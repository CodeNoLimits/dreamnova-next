# Hypercar DreamNova : assets du cockpit (19/10/2026)

## 0. Recherche : 5 principes de réalisation (Tesla Roadster et pubs d'hypercars)
Honnêteté : la recherche web n'a trouvé **aucune fiche technique de tournage** (objectifs, éclairage) de la révélation du Roadster 2026. Elle confirme seulement un événement « spectacle » sur le site SpaceX de McGregor (rampe, plans aériens, très peu de lumière), et un plan cockpit mis en avant dès 2018. Les principes ci-dessous combinent ces éléments avec les pratiques courantes des pubs auto (studio noir, lumière en bande, bras de caméra de type Russian Arm). Ce sont des règles de métier, pas des citations de Tesla ou de Ferrari.
1. **Le noir d'abord, la lumière dessine** : studio quasi noir, une seule source longue (bande de lumière ou softbox en bande) qui rase la carrosserie. Ce sont les reflets qui révèlent les courbes, pas un éclairage général.
2. **Caméra lente et continue** : orbite ou travelling bas et régulier, sans coupe. La vitesse se suggère par la lumière qui glisse, pas par la caméra qui s'agite.
3. **Angles bas et héroïques** : trois quarts avant à hauteur de roue, puis profil. La voiture domine le cadre.
4. **Gros plans de matière** : fibre de carbone, surpiqûres, métal brossé, éclairage d'ambiance qui « respire ». Le luxe passe par la texture.
5. **Retenue** : une palette (ici noir et or), un geste par plan, aucun texte. Le silence visuel fait le prix.

## 1. Outils et comptes
- Images et vidéos générées avec les **outils natifs du CLI Grok** (`image_gen`, `image_to_video`, 720p, abonnement, 0 $). Le script d'appel est adapté de `~/opus48/dna_bh_ip_2026-10-07/media/bin/grok_media.py`, avec un GROK_HOME jetable par appel.
- Deux comptes en parallèle : `heavy` (dreamaiultimate) et `~/.grok/auth.json` (admin@holyrentals). Le réglage `coding_data_retention_opt_out` vaut **False** sur les deux (vérifié avant la vidéo) et n'a pas été modifié.
- Aucun navigateur utilisé : `dn-browser-pool` n'a pas servi, donc rien à libérer et le port de l'autre agent n'a pas été touché. Google Flow n'a pas servi non plus.
- Aucune API payante, aucun fal ou Kling.

## 2. Plans : KEEP / REJECT
| Plan | Source | Compte | Verdict |
|---|---|---|---|
| Images extérieures A_1, A_2 | image_gen | heavy | **A_1 KEEP** : un écusson ovale inventé sur le nez et une plaque à pseudo-écriture sur le flanc ont été effacés par inpaint avant l'animation. A_2 rejetée (même défaut, lumière moins belle) |
| Images portière B_1, B_2 | image_gen | heavy | Belles mais non utilisées (voir l'entrée ci-dessous) |
| Images cockpit C_1, C_2 | image_gen | heavy | **C_2 KEEP** (vrai volant rond, palettes or, start rouge et or, sélecteur rotatif). C_1 rejetée : volant en « yoke » étrange, reflet violet hors palette |
| `exterieur` i2v depuis A_1 nettoyée, 10 s | image_to_video | heavy | **KEEP** : orbite lente de l'avant 3/4 vers l'arrière 3/4, la voiture reste cohérente, arrière propre (plaque vide, aucun logo) |
| `entree` en avant depuis B_1 | image_to_video | heavy | **REJECT** : la fin montre un **logo à étoile à trois branches** sur le volant (marque réelle) et une image floue au milieu |
| `entree` en recul depuis C_2 (essai 1) | image_to_video | holyrentals | REJECT : portière « en accordéon » (3 panneaux empilés) |
| `entree` en recul (essai 2, heavy) | image_to_video | heavy | REJECT : deux carrosseries qui fusionnent au milieu, petit écusson sur le nez |
| `entree` en recul (essai 3, holyrentals) | image_to_video | holyrentals | **KEEP**, puis **inversé** : la caméra part de l'extérieur, passe la portière et finit **exactement** sur le cadrage de `cockpit.webp` |
| `cockpit` i2v depuis C_2, 6 s | image_to_video | holyrentals | **KEEP** : caméra fixe, lumière d'ambiance qui respire |

Astuce clé : la vidéo **en recul** depuis l'image du cockpit, puis inversée, garantit que la dernière image de la séquence correspond à `cockpit.webp`. Écart mesuré entre `f_079.webp` et `cockpit.webp` : 2,6/255 en moyenne, donc même cadrage.

## 3. Livrables (mesurés)
- `exterieur.mp4` : H.264 1280×720, sans audio, crf 27, +faststart, 9,04 s, **1,42 Mo**. Boucle par fondu de 1 s entre la fin et le début (écart à la jointure 5,8/255).
- `cockpit.mp4` : H.264 1280×720, sans audio, crf 27, +faststart, 5,04 s, **0,78 Mo**. Boucle par fondu (écart à la jointure 3,5/255).
- `exterieur_poster.webp`, `cockpit_poster.webp` : première image de chaque boucle.
- `seq/f_000.webp` à `f_079.webp` : 80 images 1280×720, qualité 72, **3,8 Mo** au total, dans l'ordre extérieur → portière → cockpit. Vérification sur les 80 images : aucun saut (écart maximal entre images voisines 22,7, inférieur à 3 fois la médiane de 11,4).
- `cockpit.webp` : 1920×1080, agrandie (Lanczos + accentuation) depuis le 1280×720 natif de Grok. Une marque en relief presque invisible sur le moyeu du volant a été effacée.
- `hotspots.json` : 11 zones repérées à l'œil et contrôlées sur la superposition (volant, palette gauche, palette droite, compteur, écran central, bouton start, sélecteur, lumière d'ambiance, portière, siège, pare-brise).
- `planche.jpg` : planche-contact regardée (extérieur, séquence, cockpit, image fixe avec les zones).

## 4. Problèmes et limites honnêtes
- **Résolution** : Grok sort du 720p. `cockpit.webp` en 1920×1080 est un agrandissement, un peu doux en plein écran.
- **Deux voitures différentes** : la voiture d'`exterieur` (née de A_1) et celle de l'entrée (née du cockpit C_2) ne sont pas le même dessin. Même palette et même esprit, mais carrosserie différente. Pour un raccord parfait, il faudrait refaire l'extérieur à partir d'une image tirée de `seq/f_000`.
- **Portière** : dans les premières images de la séquence, la portière ouverte montre un double panneau (portière et cadre de vitre empilés). C'est lisible comme une portière en élytre, mais pas parfaitement réaliste.
- **Côté** : la caméra entre par la portière droite. Le volant est à gauche, la voiture se lit donc comme une conduite à gauche abordée par le côté passager. Peu visible au défilement.
- Petits détails tolérés à 720p : un câble fin du studio visible en haut de quelques images de l'entrée, une plaque de seuil dorée à motifs. Aucun texte lisible.
- Aucun logo de marque réelle dans les livrables retenus. Le seul vu (étoile à trois branches) se trouvait dans l'essai rejeté.

## 5. Sources de la recherche
- https://supercarblondie.com/tesla-roadster-unveil-event-details/
- https://electrek.co/2018/05/09/tesla-mystery-car-next-gen-roadster-video/
- https://youmind.com/video-prompts/hypercar-commercial-video-prompt-11411 (modèle de prompt, pas une source de tournage)
- https://advids.co/our-portfolio/teaser-advertising-video-production-by-advids (étude de cas Peugeot 9X8, texte promotionnel)
- https://morphic.com/ai-glossary/camera-car (Russian Arm, voitures caméra)
