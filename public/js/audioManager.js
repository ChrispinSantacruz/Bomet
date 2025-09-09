/**
 * Audio Manager - Sistema global de sonido para Bomet Shooter
 * Maneja música de fondo, efectos de sonido y estado de mute
 */

class AudioManager {
    constructor() {
        this.sounds = {};
        this.currentMusic = null;
        // Cambio: iniciar con audio habilitado por defecto, solo requiere primera interacción
        this.isMuted = localStorage.getItem('bometAudioMuted') === 'true'; // Por defecto unmuted
        this.audioEnabled = false; // Se habilitará con la primera interacción
        this.userHasInteracted = false; // Nuevo flag para rastrear interacción del usuario
        this.musicVolume = 0.3; // Volumen de música de fondo
        this.sfxVolume = 0.5;   // Volumen de efectos de sonido
        
        this.init();
        this.setupUserInteractionDetection();
    }

    init() {
        // Simple and reliable path detection for sound files
        const currentPath = window.location.pathname;
        const isInPagesDir = currentPath.includes('/pages/') || currentPath.endsWith('.html');
        
        // Determine base path for sounds
        let soundsPath;
        if (isInPagesDir) {
            soundsPath = '../sounds/'; // We're in pages/ directory, go up to find sounds/
        } else {
            soundsPath = 'sounds/'; // We're in root, sounds/ is relative to current location
        }
        
        // Precargar todos los sonidos con rutas dinámicas
        this.loadSound('menu', soundsPath + 'menu.mp3', true);
        this.loadSound('game', soundsPath + 'game.mp3', true);
        this.loadSound('playerShoot', soundsPath + 'disparo_personaje.mp3');
        this.loadSound('enemyShoot', soundsPath + 'disparo_enemigo.mp3');
        this.loadSound('enemyDamage', soundsPath + 'daño_enemigo.mp3');
        this.loadSound('gameOver', soundsPath + 'Gameover.mp3');

        // Log para debug
        console.log('AudioManager: Environment detection:');
        console.log('- URL:', window.location.href);
        console.log('- Port:', window.location.port);
        console.log('- Pathname:', window.location.pathname);
        console.log('- In pages directory:', isInPagesDir);
        console.log('- Sounds path:', soundsPath);

        // Actualizar estado inicial de mute
        this.updateMuteState();
        console.log('AudioManager initialized. Muted:', this.isMuted);
    }

    // Nuevo método para detectar interacción del usuario automáticamente
    setupUserInteractionDetection() {
        const enableAudioOnFirstInteraction = () => {
            if (!this.userHasInteracted) {
                console.log('🎵 Primera interacción detectada - habilitando audio automáticamente');
                this.userHasInteracted = true;
                this.audioEnabled = true;
                localStorage.setItem('bometAudioEnabled', 'true');
                
                // Intentar reproducir música apropiada para la página actual
                this.autoPlayContextualMusic();
                
                // Actualizar botones
                this.updateMuteButtons();
            }
        };

        // Detectar cualquier tipo de interacción del usuario
        const interactionEvents = ['click', 'keydown', 'touchstart', 'mousedown'];
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, enableAudioOnFirstInteraction, { once: true });
        });
    }

    // Reproducir música automáticamente basada en la página actual
    autoPlayContextualMusic() {
        if (this.isMuted) return;
        
        const currentPage = window.location.pathname;
        console.log('🎵 Reproduciendo música contextual para:', currentPage);
        
        if (currentPage.includes('game_canvas')) {
            setTimeout(() => this.playGameMusic(), 100);
        } else if (currentPage.includes('welcome') || currentPage.includes('login') || 
                   currentPage.includes('instructions') || currentPage.includes('leaderboard')) {
            setTimeout(() => this.playMenuMusic(), 100);
        }
    }

    loadSound(name, src, isMusic = false) {
        console.log(`Loading sound "${name}" from: ${src}`);
        
        const audio = new Audio(src);
        audio.preload = 'auto';
        
        if (isMusic) {
            audio.loop = true;
            audio.volume = this.musicVolume;
        } else {
            audio.volume = this.sfxVolume;
        }

        // Manejo de errores de carga
        audio.addEventListener('error', (e) => {
            console.warn(`Failed to load sound: ${name} (${src})`, e);
            console.warn(`Error details:`, e.target.error);
        });

        audio.addEventListener('canplaythrough', () => {
            console.log(`Sound loaded successfully: ${name}`);
        });

        this.sounds[name] = {
            audio: audio,
            isMusic: isMusic,
            isPlaying: false
        };
    }

    // Reproducir música de fondo (con transición suave)
    playMusic(musicName) {
        if (this.isMuted) {
            console.log(`Music ${musicName} not played: audio is muted`);
            return;
        }
        
        const sound = this.sounds[musicName];
        if (!sound || !sound.isMusic) {
            console.warn(`Music not found: ${musicName}`);
            return;
        }

        // Si ya está sonando la misma música, no hacer nada
        if (this.currentMusic === musicName && sound.isPlaying) {
            console.log(`Music ${musicName} already playing`);
            return;
        }

        // Detener música actual
        this.stopCurrentMusic();

        console.log(`Attempting to play music: ${musicName}`);

        // Si el usuario no ha interactuado, configurar para reproducir después
        if (!this.userHasInteracted) {
            console.log(`⏰ Música ${musicName} será reproducida después de la primera interacción`);
            const playMusicAfterInteraction = () => {
                if (this.userHasInteracted && !this.isMuted) {
                    this.playMusic(musicName); // Llamada recursiva después de la interacción
                }
            };
            document.addEventListener('click', playMusicAfterInteraction, { once: true });
            document.addEventListener('keydown', playMusicAfterInteraction, { once: true });
            return;
        }

        // Reproducir nueva música
        try {
            sound.audio.currentTime = 0;
            const playPromise = sound.audio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        sound.isPlaying = true;
                        this.currentMusic = musicName;
                        console.log(`✅ Successfully playing music: ${musicName}`);
                    })
                    .catch(error => {
                        console.warn(`❌ Failed to play music ${musicName}:`, error);
                    });
            }
        } catch (error) {
            console.warn(`Error playing music ${musicName}:`, error);
        }
    }

    // Set up handler for user interaction to enable audio
    setupUserInteractionHandler(musicName) {
        const enableAudio = () => {
            console.log('User interaction detected, enabling audio...');
            this.playMusic(musicName);
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };
        
        document.addEventListener('click', enableAudio, { once: true });
        document.addEventListener('keydown', enableAudio, { once: true });
    }

    // Detener música actual
    stopCurrentMusic() {
        if (this.currentMusic && this.sounds[this.currentMusic]) {
            const currentSound = this.sounds[this.currentMusic];
            currentSound.audio.pause();
            currentSound.audio.currentTime = 0;
            currentSound.isPlaying = false;
        }
        this.currentMusic = null;
    }

    // Reproducir efecto de sonido
    playSound(soundName) {
        // Si el usuario ha interactuado al menos una vez, permitir efectos de sonido incluso si está "muted"
        // Solo evitar si está explícitamente silenciado por el usuario
        if (this.isMuted && this.userHasInteracted) return;
        
        const sound = this.sounds[soundName];
        if (!sound || sound.isMusic) {
            console.warn(`Sound effect not found: ${soundName}`);
            return;
        }

        try {
            // Reiniciar el sonido para poder reproducirlo múltiples veces
            sound.audio.currentTime = 0;
            
            // Si el usuario no ha interactuado aún, intentar reproducir cuando haya interacción
            if (!this.userHasInteracted) {
                console.log(`⏰ Sonido ${soundName} será reproducido después de la primera interacción`);
                const playAfterInteraction = () => {
                    if (this.userHasInteracted && !this.isMuted) {
                        const playPromise = sound.audio.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                console.warn(`Failed to play delayed sound ${soundName}:`, error);
                            });
                        }
                    }
                };
                // Intentar reproducir en la siguiente interacción
                document.addEventListener('click', playAfterInteraction, { once: true });
                document.addEventListener('keydown', playAfterInteraction, { once: true });
                return;
            }
            
            const playPromise = sound.audio.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Failed to play sound ${soundName}:`, error);
                });
            }
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }

    // Toggle mute/unmute
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('bometAudioMuted', this.isMuted.toString());
        
        // Si se está des-muteando, asegurar que el audio esté habilitado
        if (!this.isMuted) {
            this.audioEnabled = true;
            this.userHasInteracted = true; // Contar toggle como interacción
            localStorage.setItem('bometAudioEnabled', 'true');
            
            // Iniciar música automáticamente
            setTimeout(() => {
                this.autoPlayContextualMusic();
            }, 200);
        }
        
        this.updateMuteState();
        
        console.log('Audio muted:', this.isMuted);
        return this.isMuted;
    }

    // Activar audio manualmente (primera vez) - simplificado
    enableAudio() {
        this.isMuted = false;
        this.audioEnabled = true;
        this.userHasInteracted = true; // Marcar como que el usuario ya interactuó
        localStorage.setItem('bometAudioMuted', 'false');
        localStorage.setItem('bometAudioEnabled', 'true');
        this.updateMuteState();
        
        // Iniciar música apropiada inmediatamente
        this.autoPlayContextualMusic();
        
        console.log('Audio enabled manually');
    }

    // Actualizar estado de mute en todos los audios
    updateMuteState() {
        Object.values(this.sounds).forEach(sound => {
            sound.audio.muted = this.isMuted;
        });

        // Actualizar botones de mute en la página
        this.updateMuteButtons();
    }

    // Actualizar apariencia de botones de mute
    updateMuteButtons() {
        const muteButtons = document.querySelectorAll('.mute-button');
        muteButtons.forEach(button => {
            const icon = button.querySelector('.mute-icon');
            if (icon) {
                icon.textContent = this.isMuted ? '🔇' : '🔊';
            }
            button.title = this.isMuted ? 'Activar Audio' : 'Silenciar Audio';
            
            // Agregar clase visual para audio deshabilitado
            if (this.isMuted && !this.audioEnabled) {
                button.classList.add('audio-disabled');
            } else {
                button.classList.remove('audio-disabled');
            }
        });
    }

    // Métodos de conveniencia para música específica
    playMenuMusic() {
        this.playMusic('menu');
    }

    playGameMusic() {
        this.playMusic('game');
    }

    // Métodos de conveniencia para efectos específicos
    playPlayerShoot() {
        this.playSound('playerShoot');
    }

    playEnemyShoot() {
        this.playSound('enemyShoot');
    }

    playEnemyDamage() {
        this.playSound('enemyDamage');
    }

    playGameOver() {
        this.playSound('gameOver');
    }

    // Getter para estado de mute
    get muted() {
        return this.isMuted;
    }

    // Test function para verificar rutas
    testSoundPaths() {
        const currentPath = window.location.pathname;
        const isInPagesDir = currentPath.includes('/pages/') || currentPath.endsWith('.html');
        const soundsPath = isInPagesDir ? '../sounds/' : 'sounds/';
        
        console.log('=== AUDIO PATHS TEST ===');
        console.log('Current URL:', window.location.href);
        console.log('Port:', window.location.port);
        console.log('Pathname:', window.location.pathname);
        console.log('In pages directory:', isInPagesDir);
        console.log('Sounds path:', soundsPath);
        console.log('Full menu path:', soundsPath + 'menu.mp3');
        
        // Test si el archivo existe
        const testAudio = new Audio(soundsPath + 'menu.mp3');
        testAudio.addEventListener('canplaythrough', () => {
            console.log('✅ Menu audio file is accessible');
        });
        testAudio.addEventListener('error', (e) => {
            console.log('❌ Menu audio file NOT accessible:', e);
        });
    }
}

// Crear instancia global del gestor de audio
window.audioManager = new AudioManager();

// Exponer métodos globalmente para fácil acceso
window.playMenuMusic = () => window.audioManager.playMenuMusic();
window.playGameMusic = () => window.audioManager.playGameMusic();
window.playPlayerShoot = () => window.audioManager.playPlayerShoot();
window.playEnemyShoot = () => window.audioManager.playEnemyShoot();
window.playEnemyDamage = () => window.audioManager.playEnemyDamage();
window.playGameOver = () => window.audioManager.playGameOver();
window.toggleAudioMute = () => window.audioManager.toggleMute();
window.enableAudio = () => window.audioManager.enableAudio();

// Test function para debug
window.testAudioPaths = () => window.audioManager.testSoundPaths();

// Manual audio test functions
window.testMenuMusic = () => {
    console.log('🎵 Testing menu music...');
    window.audioManager.playMusic('menu');
};

window.testGameMusic = () => {
    console.log('🎵 Testing game music...');
    window.audioManager.playMusic('game');
};

window.testSoundEffect = () => {
    console.log('🔫 Testing sound effect...');
    window.audioManager.playSound('playerShoot');
};
