# Scènes d'action DreamNova (19/10/2026)

**Méthode** : image d'abord, puis animation, sur abonnement uniquement. Les images fixes viennent de l'outil natif `image_edit` de Grok, à partir de deux vraies photos recadrées de David (`ref_A`, `ref_B`). L'animation vient de l'outil natif `image_to_video` de Grok : 720p, 10 s, consigne courte en anglais, sans prompt négatif. Je n'ai utilisé aucune API payante ni aucun navigateur : aucun port CDP ouvert, aucune fenêtre, aucun conflit avec l'agent qui travaille dans Flow. J'ai pris l'inspiration Higgsfield (FPV, orbites de drone à 360°, grand angle, ralentis) dans les consignes de caméra.

**Comptes** : Grok « heavy » et Grok actif « holyrentals ». **À 20 h 26, le compte holyrentals a répondu `402 Grok Build usage balance exhausted`** : son crédit est épuisé. Le compte heavy fonctionne toujours.

**Fichiers techniques** (tous vérifiés avec ffprobe) :
- H.264, sans piste audio, `+faststart` (le `moov` est en tête sur les 10 fichiers).
- 16:9 en 1280×720 et 9:16 en 720×1280, 24 i/s, 10,04 s par clip.
- CRF 26, remonté à 28 quand le clip dépassait 3,9 Mo (`sea_m`).
- Fondu au noir de 0,4 s en début et en fin de clip.
- Tous les clips pèsent moins de 4 Mo (le plus lourd fait 3,98 Mo).
- Un poster `.webp` par clip, pris à 45 % de la durée.

**Pas de 1920×1080** : Grok produit au maximum du 720p. Je n'ai pas fait d'agrandissement artificiel.

**Mesure du visage** : score ArcFace contre 4 vraies photos de David, à 8 instants de chaque clip. Le premier instant tombe dans le fondu noir, donc sans visage. Repères : au-dessus de 0,40, c'est la même personne pour le modèle ; le seuil « cinéma » est 0,65. Sous environ 80 px de visage, le score n'est pas fiable. Ces plans sont volontairement de loin, de dos ou de profil.

| Clip | Contenu | Ressemblance ArcFace (taille du visage) | Problèmes, honnêtement |
|---|---|---|---|
| parachute | Chute libre (FPV) au-dessus d'îles flottantes et de cascades de lumière, puis le parachute noir et or s'ouvre, bras en croix | 0,53 / 0,50 / 0,53 / 0,54 en gros plan, 0,40 de loin | Expressions très « cri de joie » (bouche grande ouverte). La voile porte un motif doré en étoile. Une barre rigide au-dessus de sa tête est peu réaliste |
| parachute_m | Chute libre de face, plongée entre les falaises, la voile s'ouvre | 0,69 / 0,63 / 0,61, puis 0,47 à 0,53 | Même voile en étoile. Bonne lecture du visage au début |
| mountain | Portrait au sommet, puis orbite de drone qui recule jusqu'au plan très large (îles flottantes, cascades d'or, mer de nuages) | 0,72 / 0,68 / 0,61 de près | Rien de bloquant. Il devient minuscule à la fin (c'est voulu) |
| mountain_m | Même scène en vertical, recul jusqu'à le montrer en pied | 0,81 / 0,77 / 0,73 / 0,75 / 0,72 | Le meilleur score du lot |
| paraglide | Drone qui l'accompagne en parapente noir et or au-dessus de falaises et d'une mer turquoise, au coucher du soleil | 0,32 à 0,38 (visage de 66 px, de profil) | Visage non vérifiable (de loin, c'est voulu). Pendant le virage, la voile se plie un instant de façon peu réaliste. Un motif doré en chevron sur la voile : ce n'est pas un logo connu |
| paraglide_m | Vue drone large, falaises dorées, mer turquoise | Visage trop petit (environ 20 px) | Le plan le plus « carte postale » |
| bungee | Il se tient au bord d'un pont au-dessus d'un canyon doré, saute, chute, l'élastique se tend, rebond et suspension au ralenti | 0,54 (147 px) au départ | Pendant la chute, on voit surtout l'élastique et le canyon (il est petit). À la fin, l'élastique est attaché au dos au lieu des chevilles : incohérence physique |
| bungee_m | Saut depuis le pont, plongée tête la première, suspension en contre-jour | 0,19 à 0,29 (petit) | Visage non vérifiable. La séquence saut, chute, rebond est la plus lisible des deux |
| sea | Il nage sous l'eau turquoise dans les rayons d'or, remonte et sort la tête au soleil | 0,55 à 0,58, puis 0,53 à la surface | Pendant environ 0,3 s avant la surface, des bulles lui couvrent le visage. Après la sortie de l'eau, de l'eau coule de sa barbe |
| sea_m | Il pousse sur le fond de sable, remonte, sort à la surface | 0,57 / 0,60 / 0,49, puis 0,49 à 0,52 | Pendant la montée, quelques bulles restent collées à son t-shirt |

**Essais rejetés** :
- Mer, versions 1, 2 et 3 : de gros « masques » de bulles couvraient le visage pendant 2 à 4 s. La version 1 avait aussi un passage chaotique avec un pied au premier plan.
- Seconde prise du parachute, sous la voile de face : plan statique, yeux fermés, et voile différente de la première, donc rupture de continuité.
- Image verticale du parachute où l'homme regarde une voile qui flotte séparément.

**Tenue** : casquette noire, lunettes fines, barbe poivre et sel et vêtements noirs dans tous les plans. Le casque audio est au cou dans les scènes aériennes et la montagne. Pour la mer, il porte un t-shirt noir (ni veste ni casque dans l'eau).

**Ce qui n'a pas été fait** :
- **rocket.mp4 et rocket_seq/** : la consigne de l'orchestrateur (un autre agent fait l'espace) m'autorisait à abandonner la fusée, et je ne l'avais pas commencée. Je ne l'ai donc pas faite.
- **Face-swap sur ces scènes** : je l'ai testé sur la mer, sans affinage GFPGAN. Le score monte de 0,37–0,60 à 0,61–0,66. Mais quand les bulles et l'eau couvrent le visage, le collage laisse un rectangle plus sombre visible. Je ne l'ai donc pas appliqué : les scènes gardent le visage de Grok, généré à partir des vraies photos.

**Contrôle** : `planche.jpg` montre la vraie photo, puis 3 images par clip 16:9 et 3 par clip 9:16. Je l'ai regardée. J'ai aussi regardé une planche de 16 images par clip pour chacun des 10 clips.

Rien n'a été envoyé à personne ni publié, et aucun déploiement n'a été fait.
