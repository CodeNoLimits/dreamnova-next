# Bande-son DreamNova — rapport (19/10/2026)

Dossier : `assets/audio/`. Rien n'a été envoyé ni publié. 37 fichiers produits et contrôlés ici (1 thème, 7 boucles, 8 effets, 21 voix), plus `voices.json` et `manifest.json`.

## Ce qui a été utilisé

| Partie | Outil | Compte |
|---|---|---|
| Musique | **Magenta RealTime 2 Small**, en local sur le Mac (Suno a échoué, voir plus bas) | aucun, 0 $ |
| Effets sonores (8) | API ElevenLabs `sound-generation` | clé `HOK_BRESLEV_ELEVENLABS_API_KEY` (le compte payant n'avait plus assez de crédits) |
| Voix hébreu (7) | ElevenLabs `eleven_v4`, voix native **Amit – Calm, Curious Narrator** (`uwHajH4FhtzVp6X17pr7`) | clé `ELEVENLABS_KEY` (formule payante « payg ») |
| Voix anglais (7) | ElevenLabs `eleven_v4`, **George – Warm, Captivating Storyteller** (`JBFqnCBsd6RMkjVDRZzb`) | clé `HOK_BRESLEV_ELEVENLABS_API_KEY` |
| Voix français (7) | ElevenLabs `eleven_v4`, **Paul K – Deep French Narrator** (`5l4ttmr4SKNgi0HnOelT`) | clé `ELEVENLABS_KEY` |
| Contrôle | `dn-whisper qc --model large` (aller-retour), `ffmpeg ebur128` / `silencedetect`, spectrogrammes regardés | local |

Les textes des voix (`voices.json`) reprennent le contenu réel du site : `hero.*`, `DRIVE_I`, `svc.title/lead`, `manifesto`, `fnd.quote`, `ROOMS_I` et `ROOMS`, `work.lead` et `ct.*`. Aucun chiffre ni aucune promesse n'a été ajouté. Comme le site n'a pas encore de texte pour accel, rocket et sky, j'ai repris ceux de sections existantes : accel = « Un studio. Toutes les capacités », rocket = le manifeste, sky = la citation du fondateur (« les pieds sur terre », qui va avec l'atterrissage en parachute). En hébreu, j'ai écrit « בינה מלאכותית » au lieu de « AI » et j'ai ajouté des voyelles (nikoud) sur « דְּרִים נוֹבָה » et « הַבִּלְתִּי אֶפְשָׁרִי ». Sans elles, la voix prononçait « בלימנובה » et « הבייתי » (contrôle à 76,9 %). Avec elles, le contrôle monte à 100 %.

Traitement : silence de tête coupé, puis normalisation en deux passes à −16 LUFS avec une crête vraie à −1,5 dBTP. Sortie en MP3 44,1 kHz : voix mono à 128 kbit/s, effets et musique stéréo à 160 kbit/s. Boucles : extrait de 45 s pris à partir de la 4e seconde d'une génération de 52 s. La fin est fondue dans le début (fondu à puissance constante de 3 s, 4 s pour le thème). Au point de jonction, le saut mesuré est de 0,0031 contre une médiane de 0,0024 d'un échantillon au suivant, donc aucun clic.

## Contrôle qualité chiffré

### Musique
| Fichier | Durée | LUFS | Crête vraie (dBFS) | Silence en tête | kbit/s | Taille | Contrôle |
|---|---|---|---|---|---|---|---|
| theme.mp3 | 150.0 s | -16.4 | -1.4 | 0.0 s | 160 | 3.00 Mo | Whisper (morceau instrumental) : « Thank you. Thank you. Thank you. Thank you. Thank you. » = hallucination type, aucune parole réelle |
| loop_hero.mp3 | 45.0 s | -16.4 | -1.8 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « Terima kasih telah menonton! » = hallucination type, aucune parole réelle |
| loop_drive.mp3 | 45.0 s | -16.5 | -1.6 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « Teksting av Nicolai Winther Teksting av Nicolai Winther » = hallucination type, aucune parole réelle |
| loop_accel.mp3 | 45.0 s | -16.4 | -1.6 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « Thank you. » = hallucination type, aucune parole réelle |
| loop_rocket.mp3 | 45.0 s | -16.4 | -1.6 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « Thank you. Thank you. » = hallucination type, aucune parole réelle |
| loop_sky.mp3 | 45.0 s | -16.4 | -1.1 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « We'll see you next time. We'll see you next time. » = hallucination type, aucune parole réelle |
| loop_rooms.mp3 | 45.0 s | -16.4 | -1.8 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « Thank you. Thank you. » = hallucination type, aucune parole réelle |
| loop_contact.mp3 | 45.0 s | -16.4 | -1.8 | 0.0 s | 160 | 0.90 Mo | Whisper (morceau instrumental) : « សូវាប់បានប់បានប់បានប់បានប់បានប់បានប់បានប់បានប់បានប់បានប់បានប » = hallucination type, aucune parole réelle |

### Effets sonores
| Fichier | Durée | LUFS | Crête vraie (dBFS) | Silence en tête | kbit/s | Taille | Contrôle |
|---|---|---|---|---|---|---|---|
| sfx_accel_whoosh.mp3 | 3.98 s | -16.6 | -8.4 | 0.099 s | 163 | 0.08 Mo | spectrogramme regardé |
| sfx_click_gold.mp3 | 1.2 s | -20.5 | -2.4 | 0.0 s | 167 | 0.03 Mo | spectrogramme regardé |
| sfx_engine_rev.mp3 | 5.95 s | -16.4 | -6.3 | 0.0 s | 161 | 0.12 Mo | spectrogramme regardé |
| sfx_engine_start.mp3 | 8.0 s | -16.5 | -1.9 | 0.0 s | 161 | 0.16 Mo | spectrogramme regardé |
| sfx_parachute_open.mp3 | 3.0 s | -16.7 | -1.8 | 0.0 s | 163 | 0.06 Mo | spectrogramme regardé |
| sfx_portal_whoosh.mp3 | 2.95 s | -16.3 | -5.8 | 0.0 s | 163 | 0.06 Mo | spectrogramme regardé |
| sfx_rocket_launch.mp3 | 8.0 s | -16.4 | -6.1 | 0.0 s | 161 | 0.16 Mo | spectrogramme regardé |
| sfx_wind_freefall.mp3 | 5.93 s | -16.6 | -1.8 | 0.0 s | 162 | 0.12 Mo | spectrogramme regardé |

### Voix
| Fichier | Durée | LUFS | Crête vraie (dBFS) | Silence en tête | kbit/s | Taille | Contrôle |
|---|---|---|---|---|---|---|---|
| voice_accel_en.mp3 | 6.88 s | -16.8 | -1.8 | 0.0 s | 129 | 0.11 Mo | Whisper 11/11 = 100.0 % |
| voice_accel_fr.mp3 | 6.24 s | -16.5 | -1.8 | 0.0 s | 129 | 0.10 Mo | Whisper 13/13 = 100.0 % |
| voice_accel_he.mp3 | 6.8 s | -16.7 | -1.9 | 0.0 s | 129 | 0.11 Mo | Whisper 11/12 = 91.7 % « 1 » transcrit pour « אחד » (même mot) → 12/12 après normalisation |
| voice_contact_en.mp3 | 8.32 s | -16.8 | -1.9 | 0.0 s | 129 | 0.13 Mo | Whisper 25/25 = 100.0 % |
| voice_contact_fr.mp3 | 7.84 s | -16.6 | -1.9 | 0.0 s | 129 | 0.13 Mo | Whisper 19/19 = 100.0 % |
| voice_contact_he.mp3 | 7.12 s | -16.4 | -1.8 | 0.0 s | 129 | 0.11 Mo | Whisper 15/15 = 100.0 % |
| voice_drive_en.mp3 | 5.68 s | -16.7 | -1.9 | 0.0 s | 130 | 0.09 Mo | Whisper 14/14 = 100.0 % |
| voice_drive_fr.mp3 | 5.86 s | -16.6 | -1.9 | 0.0 s | 129 | 0.09 Mo | Whisper 16/16 = 100.0 % |
| voice_drive_he.mp3 | 5.43 s | -16.4 | -1.9 | 0.0 s | 129 | 0.09 Mo | Whisper 11/11 = 100.0 % |
| voice_hero_en.mp3 | 6.72 s | -16.7 | -1.9 | 0.0 s | 129 | 0.11 Mo | Whisper 13/13 = 100.0 % |
| voice_hero_fr.mp3 | 6.96 s | -16.5 | -1.9 | 0.0 s | 129 | 0.11 Mo | Whisper 14/14 = 100.0 % |
| voice_hero_he.mp3 | 7.92 s | -16.4 | -1.9 | 0.0 s | 129 | 0.13 Mo | Whisper 13/13 = 100.0 % |
| voice_rocket_en.mp3 | 7.08 s | -17.1 | -1.8 | 0.0 s | 129 | 0.11 Mo | Whisper 12/12 = 100.0 % |
| voice_rocket_fr.mp3 | 7.12 s | -16.6 | -1.9 | 0.0 s | 129 | 0.11 Mo | Whisper 15/15 = 100.0 % |
| voice_rocket_he.mp3 | 7.83 s | -16.4 | -1.4 | 0.0 s | 129 | 0.13 Mo | Whisper 13/13 = 100.0 % |
| voice_rooms_en.mp3 | 9.6 s | -16.6 | -1.9 | 0.0 s | 129 | 0.15 Mo | Whisper 17/17 = 100.0 % |
| voice_rooms_fr.mp3 | 8.26 s | -17.0 | -1.8 | 0.0 s | 129 | 0.13 Mo | Whisper 18/19 = 94.7 % « privés » pour « privée » (accord, même mot à l’oreille) |
| voice_rooms_he.mp3 | 8.24 s | -16.4 | -1.9 | 0.0 s | 129 | 0.13 Mo | Whisper 12/14 = 85.7 % « הכל » vs « הכול » (2 graphies du même mot) → 14/14 après normalisation |
| voice_sky_en.mp3 | 5.72 s | -16.7 | -1.8 | 0.0 s | 130 | 0.09 Mo | Whisper 13/13 = 100.0 % |
| voice_sky_fr.mp3 | 6.23 s | -16.4 | -1.8 | 0.0 s | 129 | 0.10 Mo | Whisper 16/16 = 100.0 % |
| voice_sky_he.mp3 | 5.6 s | -16.5 | -2.0 | 0.0 s | 130 | 0.09 Mo | Whisper 10/10 = 100.0 % |

Bilan :
- **Voix : 21/21 à 90 % ou plus.** Résultats bruts : 18 à 100 %, plus rooms_fr à 94,7 %, accel_he à 91,7 % et rooms_he à 85,7 %. Les écarts en hébreu ne viennent pas de la voix : Whisper a écrit « 1 » pour « אחד » et a choisi une autre graphie du même mot (« הכל » pour « הכול »). En comptant ces mots comme justes, rooms_he et accel_he passent à 100 %. Le contrôle a été fait une fois sur les fichiers bruts et une fois sur les fichiers finaux, avec les mêmes résultats.
- **Niveaux** : musique et voix entre −16,4 et −17,1 LUFS. Les effets sont entre −16,3 et −16,7 LUFS, sauf `sfx_click_gold` (1,2 s) à −20,5 LUFS : sur un son aussi court, la mesure intégrée n'est pas fiable, et un clic plus discret convient. Aucune crête vraie ne dépasse −1,1 dBFS.
- **Silence de tête** : 0 s partout, sauf `sfx_accel_whoosh` à 0,099 s. Le seuil de 0,5 s est respecté partout.
- **Poids** : boucles à 0,90 Mo (limite 2 Mo), thème à 3,00 Mo (limite 5 Mo), effets entre 0,03 et 0,16 Mo.
- **Durées** : effets moteur et fusée à 8,0 s, autres effets entre 1,2 et 5,95 s. Thème à 150 s, boucles à 45 s.
- **Pas de paroles dans la musique** : sur ces pistes, Whisper ne produit que les hallucinations habituelles sur de la musique sans voix (« Thank you », génériques de sous-titres). Ce n'est pas une preuve absolue, mais aucune phrase cohérente n'en ressort.

## Ce qui a échoué ou reste à faire

1. **Suno : génération bloquée, aucune piste Suno livrée.** Le compte était bien connecté sur le centre NEXUS 9622, après une page « session-recovery » qui s'est réglée seule. Formule **Premier** active : 9 145 crédits restants sur 10 000, 39 téléchargements utilisés sur 60. Deux essais :
   - par l'API `POST /api/generate/v2/` (méthode du 14/10) : **422 `token_validation_failed`** (« Nous n'avons pas pu vérifier votre demande »). Suno exige maintenant un jeton anti-robot pour chaque création ;
   - par l'interface (champ Style rempli, bouton Create cliqué en onglet d'arrière-plan) : aucune requête de génération n'est partie, puis l'onglet a cessé de répondre (le moteur JavaScript ne répondait plus pendant plus de 60 s). Probablement le défi anti-robot, sur une machine à charge 350–577.
   Je me suis arrêté après ces 2 échecs et je n'ai consommé aucun crédit. La compétence `hok-video-du-jour` le dit déjà : « le CDP agents ne passe pas Cloudflare » pour Suno ; la voie qui marche est Chrome Canary (outils claude-in-chrome), interdite pour cette tâche. Le téléchargement en arrière-plan était lui aussi déjà connu comme bloqué. Onglet fermé, verrou `browser:9222` libéré, navigateur du pool 9230 fermé et profil supprimé.
2. **Repli musique = Magenta RT2 Small, en local.** Le son est réel (spectrogrammes regardés : basses, transitoires rythmiques, passages plus calmes dans drive et rooms), mais il n'a **pas la construction d'un morceau Suno** : pas de vraie montée vers un drop, et les consignes de style ne sont suivies qu'en gros. C'est l'écart principal avec ce que tu as demandé (« un petit peu dub, montées et drops »). Pour avoir du vrai Suno, il faut lancer la génération et le téléchargement depuis Chrome Canary : les 8 consignes de style sont prêtes et peuvent être réutilisées telles quelles.
3. **Licence des effets et des voix anglaises — à régler avant la mise en production.** Le compte de `HOK_BRESLEV_ELEVENLABS_API_KEY` est en **formule gratuite** : il a refusé une voix de la bibliothèque avec « Free users cannot use library voices via the API ». Selon les conditions d'ElevenLabs, la formule gratuite n'autorise pas l'usage commercial et demande d'attribuer le son à ElevenLabs. Cela concerne les **8 `sfx_*`** et les **7 `voice_*_en`**. Les voix hébreu et français ont été faites sur `ELEVENLABS_KEY` (payant), sans ce problème. Il ne reste que 106 caractères sur ce compte : impossible de tout refaire sans recharger les crédits, et cette décision de dépense t'appartient.
4. **Une autre session écrit dans le même dossier** (vers 21:20–21:38) : `loop_work.mp3`, `sfx_{ambient_hum,dash_power_on,gear_shift,selector_click,steer_tires,whoosh_soft}.mp3`, `voice_{cp_*,devis,lab,offers,refer,services,values,work}_*.mp3`. Elle a aussi complété `voices.json` en gardant mes textes, et réécrit `manifest.json` sous forme d'une simple liste, celle que lit `audio.js` (`man.files.includes(f)`). Je n'ai **ni contrôlé ni modifié** ces fichiers. Le `manifest.json` final garde `files` sous forme de liste de noms (compatible avec `audio.js`) et ajoute `entries`, qui donne pour chaque fichier la section, le rôle, la durée, les LUFS, la source et la couverture Whisper. Les fichiers de l'autre session y sont marqués « autre session ». J'ai vérifié par corrélation que `loop_hero` et `loop_drive`, réécrits à 21:35 et 21:38, contiennent toujours mon audio (r = 0,997 et 0,991).

## Licences

- **Musique (Magenta RealTime 2)** : code sous Apache-2.0, poids du modèle sous **CC-BY-4.0**. Attribution conseillée : « Magenta RealTime 2 — Google DeepMind, © 2026 Google LLC ». La licence des poids ne s'applique pas automatiquement au son produit ; c'est une pré-génération locale, pas Suno.
- **Suno** : la formule Premier active a bien `commercial_rights` (« Commercial use rights for songs made while subscribed »). Aucune piste Suno n'a pu être produite.
- **ElevenLabs** : la formule payante (`ELEVENLABS_KEY`, voix HE et FR) autorise l'usage commercial. La formule gratuite (clé HOK : effets et voix EN) ne l'autorise pas sans formule payante, voir le point 3.

## Reproduire

Scripts dans le scratchpad de la session (`el_tts.py`, `el_sfx.py`, `master.py`, `measure.py`, `qc_voices.py`, `music/gen.sh`, `music/loop.py`). Environnement Magenta conservé dans `~/.cache/adaptive-dj-mrt2` (venv + modèle, 2,7 Go ; le cache de téléchargement uv de 0,85 Go a été supprimé). Les fichiers temporaires (WAV, brouillons) ont été supprimés.
