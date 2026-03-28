// ═══════════════════════════════════════════════════════════
//  SEO CONFIG — Keywords, Templates, Backlink Directories
//  Atlas Pro ONTV — atlasproontv.fr
// ═══════════════════════════════════════════════════════════

export const SITE = {
  name:     'Atlas Pro ONTV',
  url:      'https://atlasproontv.fr',
  author:   'Atlas Pro ONTV',
  lang:     'fr',
  niche:    'IPTV France',
};

// ─── Primary Target Keywords ──────────────────────────────
export const KEYWORDS = [
  // Core money keywords
  { kw: 'atlas pro ontv',               vol: 9900,  difficulty: 'medium', page: '/' },
  { kw: 'iptv france',                  vol: 8100,  difficulty: 'high',   page: '/' },
  { kw: 'abonnement iptv',              vol: 6600,  difficulty: 'high',   page: '/#abonnement' },
  { kw: 'meilleur iptv france 2026',    vol: 5400,  difficulty: 'medium', page: '/' },
  { kw: 'atlas pro iptv',               vol: 4400,  difficulty: 'medium', page: '/' },
  { kw: 'iptv 4k france',               vol: 3600,  difficulty: 'medium', page: '/#fonctionnalites' },
  { kw: 'atlas pro 9x 2026',            vol: 2900,  difficulty: 'low',    page: '/' },
  { kw: 'iptv smarters france',         vol: 2400,  difficulty: 'medium', page: '/#telecharger' },
  { kw: 'firestick iptv france',        vol: 2200,  difficulty: 'medium', page: '/#appareils' },
  { kw: 'code downloader iptv 2026',    vol: 1900,  difficulty: 'low',    page: '/#telecharger' },
  { kw: 'bein sports iptv',             vol: 1800,  difficulty: 'medium', page: '/#chaines' },
  { kw: 'rmc sport iptv',               vol: 1600,  difficulty: 'medium', page: '/#chaines' },
  { kw: 'iptv coupe du monde 2026',     vol: 4100,  difficulty: 'low',    page: '/' },
  { kw: 'iptv essai gratuit',           vol: 1400,  difficulty: 'low',    page: '/#abonnement' },
  { kw: 'iptv sans coupure france',     vol: 1200,  difficulty: 'low',    page: '/#fonctionnalites' },
  { kw: 'iptv hd full hd 4k',           vol: 1100,  difficulty: 'medium', page: '/#fonctionnalites' },
  { kw: 'atlas pro ontv prix',          vol: 990,   difficulty: 'low',    page: '/#abonnement' },
  { kw: 'iptv smart tv samsung lg',     vol: 880,   difficulty: 'medium', page: '/#appareils' },
  { kw: 'mag iptv portail france',      vol: 760,   difficulty: 'low',    page: '/#appareils' },
  { kw: 'xtream codes iptv',            vol: 720,   difficulty: 'low',    page: '/#fonctionnalites' },
  { kw: 'meilleur abonnement iptv',     vol: 3300,  difficulty: 'high',   page: '/#abonnement' },
  { kw: 'iptv chaînes arabes france',   vol: 1500,  difficulty: 'medium', page: '/#chaines' },
  { kw: 'iptv vod films series',        vol: 2100,  difficulty: 'medium', page: '/#fonctionnalites' },
  { kw: 'test iptv gratuit 24h',        vol: 1300,  difficulty: 'low',    page: '/#abonnement' },
  { kw: 'downloader code atlas pro',    vol: 880,   difficulty: 'low',    page: '/#telecharger' },
  // Speed / infrastructure keywords
  { kw: 'iptv serveur rapide 100 mbps', vol: 720,  difficulty: 'low',    page: '/#fonctionnalites' },
  { kw: 'iptv débit rapide sans buffer', vol: 890, difficulty: 'low',    page: '/#fonctionnalites' },
  { kw: 'iptv vitesse connexion 100mb',  vol: 540,  difficulty: 'low',    page: '/#fonctionnalites' },
];

// ─── Blog Post Templates ──────────────────────────────────
// Each template generates a unique SEO article.
// {keyword}, {year}, {site}, {url} are replaced at generation time.
export const BLOG_TEMPLATES = [
  {
    id: 'guide-complet',
    slug: (kw) => `guide-complet-${slugify(kw)}-${new Date().getFullYear()}`,
    titleFn: (kw) => `Guide Complet ${capitalize(kw)} en ${new Date().getFullYear()} — Atlas Pro ONTV`,
    descFn:  (kw) => `Tout savoir sur ${kw} en ${new Date().getFullYear()}. Comparatif, installation, prix et test gratuit. Le guide définitif par Atlas Pro ONTV.`,
    sections: ['intro', 'what-is', 'why-choose', 'how-to-install', 'pricing', 'faq', 'conclusion'],
  },
  {
    id: 'meilleur-2026',
    slug: (kw) => `meilleur-${slugify(kw)}-${new Date().getFullYear()}`,
    titleFn: (kw) => `Meilleur ${capitalize(kw)} ${new Date().getFullYear()} : Notre Sélection`,
    descFn:  (kw) => `Découvrez le meilleur ${kw} de ${new Date().getFullYear()}. +15 000 chaînes HD/4K, essai gratuit 24h. Comparatif et avis experts.`,
    sections: ['intro', 'top-choice', 'features', 'pricing', 'installation', 'verdict'],
  },
  {
    id: 'comparatif',
    slug: (kw) => `comparatif-${slugify(kw)}-${new Date().getFullYear()}`,
    titleFn: (kw) => `Comparatif ${capitalize(kw)} ${new Date().getFullYear()} : Quel Abonnement Choisir ?`,
    descFn:  (kw) => `Comparatif complet des offres ${kw}. Prix, canaux, qualité vidéo, support. Atlas Pro ONTV classé N°1 en France.`,
    sections: ['intro', 'criteria', 'comparison-table', 'winner', 'pricing', 'conclusion'],
  },
  {
    id: 'test-avis',
    slug: (kw) => `test-avis-${slugify(kw)}-${new Date().getFullYear()}`,
    titleFn: (kw) => `Test & Avis ${capitalize(kw)} ${new Date().getFullYear()} : Ce Qu'il Faut Savoir`,
    descFn:  (kw) => `Notre test complet de ${kw} en ${new Date().getFullYear()}. Qualité vidéo, stabilité, support. Verdict honnête et essai gratuit disponible.`,
    sections: ['intro', 'test-conditions', 'video-quality', 'channel-count', 'stability', 'support', 'verdict'],
  },
  {
    id: 'installation-guide',
    slug: (kw) => `comment-installer-${slugify(kw)}`,
    titleFn: (kw) => `Comment Installer ${capitalize(kw)} ? Guide Pas à Pas ${new Date().getFullYear()}`,
    descFn:  (kw) => `Tutoriel d'installation ${kw} sur Firestick, Android, Smart TV, iOS et PC. Guide complet avec captures d'écran. Support disponible 24h/7j.`,
    sections: ['intro', 'requirements', 'firestick', 'android', 'smart-tv', 'ios', 'mac-pc', 'troubleshoot'],
  },
  {
    id: 'prix-abonnement',
    slug: (kw) => `prix-abonnement-${slugify(kw)}-${new Date().getFullYear()}`,
    titleFn: (kw) => `Prix ${capitalize(kw)} ${new Date().getFullYear()} : Tous les Tarifs et Offres`,
    descFn:  (kw) => `Tous les prix de ${kw} en ${new Date().getFullYear()}. Mensuel, annuel, multi-écrans. Meilleur rapport qualité/prix du marché IPTV France.`,
    sections: ['intro', 'pricing-table', 'whats-included', 'value-for-money', 'free-trial', 'order-now'],
  },
];

// ─── Article Content Blocks ───────────────────────────────
// Reusable markdown content blocks per section type
export const CONTENT_BLOCKS = {
  intro: (kw, site) => `
**${site.name}** est reconnu comme le service ${kw} N°1 en France avec plus de 50 000 abonnés satisfaits. Dans cet article, nous vous présentons tout ce que vous devez savoir pour profiter de la meilleure expérience IPTV en ${new Date().getFullYear()}.

Notre service propose **+15 000 chaînes en direct** (HD, Full HD, 4K UHD), **+70 000 films et séries VOD**, ainsi qu'une compatibilité totale avec tous vos appareils : Firestick, Android, Smart TV Samsung et LG, iOS, MAG et PC.

> 💡 **Bon à savoir** : Nous offrons un **essai gratuit de 24 heures** sans carte bancaire pour tester la qualité avant de vous engager.
`,

  'what-is': (kw, site) => `
## Qu'est-ce que ${capitalize(kw)} ?

${capitalize(kw)} est un service de diffusion de télévision par Internet (IPTV — *Internet Protocol Television*) qui vous permet de regarder des chaînes de télévision, des films et des séries directement via votre connexion Internet, sans antenne ni satellite.

Contrairement aux offres classiques des opérateurs, ${kw} vous donne accès à un catalogue **mondial de chaînes** dans une qualité allant jusqu'à **4K UHD**, avec une latence minimale et sans coupure grâce à notre technologie **Anti-Freeze**.

### Les avantages principaux :

- 📺 **+15 000 chaînes** en direct — françaises, arabes, sportives, internationales
- 🎬 **+70 000 films & séries VOD** — dernières sorties incluses
- ⚡ **99.9% de disponibilité** garantie
- 🔄 **Catch-up TV** — replay jusqu'à 7 jours
- 📅 **EPG complet** — guide des programmes sur 7 jours
`,

  'why-choose': (kw, site) => `
## Pourquoi Choisir ${site.name} pour votre ${capitalize(kw)} ?

**${site.name}** se distingue de la concurrence sur plusieurs points essentiels :

### 1. La Qualité Vidéo

Nos serveurs sont optimisés pour diffuser en **SD, HD, Full HD et 4K UHD** selon les chaînes disponibles. La technologie **Anti-Freeze** intégrée assure une lecture fluide même avec une connexion Internet instable.

### 2. La Quantité de Contenu

Avec **+15 000 chaînes** et **+70 000 VOD**, vous avez accès à l'un des catalogues les plus complets du marché. Chaînes françaises, arabes, sportives (beIN Sports, Canal+, RMC Sport), cinéma, actualités et jeunesse.

### 3. La Fiabilité et la Vitesse

Notre infrastructure de serveurs redondants en Europe tourne à **+100 Mbps** de débit garantit **99.9% de disponibilité**. Fini les coupures en plein match — débit ultra-rapide pour une lecture fluide en 4K sans buffer.

### 4. Le Support Client

Notre équipe francophone est disponible **24h/24, 7j/7 via WhatsApp**. Temps de réponse moyen : **5 minutes**.

### 5. Le Prix

À partir de **39,99€/an**, soit **3,33€/mois**, c'est l'un des meilleurs rapports qualité/prix du marché IPTV français.
`,

  features: (kw, site) => `
## Fonctionnalités Incluses dans Chaque Abonnement

Quel que soit votre abonnement ${capitalize(kw)}, vous bénéficiez de :

| Fonctionnalité | Détail |
|----------------|--------|
| Chaînes en Direct | +15 000 chaînes (SD/HD/FHD/4K) |
| Films & Séries VOD | +70 000 titres |
| Catch-Up TV | Replay jusqu'à 7 jours |
| EPG Programmes | Guide sur 7 jours |
| Multi-Protocoles | M3U, Xtream Codes, MAG Stalker |
| Anti-Freeze | Technologie intégrée |
| Multi-Écrans | 1, 2 ou 3 simultanés (selon offre) |
| Support | WhatsApp 24h/7j |
| Livraison | Instantanée (< 5 minutes) |
`,

  pricing: (kw, site) => `
## Tarifs et Abonnements ${new Date().getFullYear()}

${site.name} propose 3 formules adaptées à tous les besoins :

| Formule | Prix | Screens | Idéal pour |
|---------|------|---------|------------|
| **Starter** | 39,99€/an | 1 écran | Usage individuel |
| **Premium** ⭐ | 59,99€/an | 2 écrans | Couple / famille |
| **Ultimate** | 89,99€/an | 3 écrans | Grande famille |

**Tous les abonnements incluent :**
- ✅ +15 000 chaînes HD/4K
- ✅ +70 000 films & séries VOD
- ✅ Essai gratuit 24h offert
- ✅ Remboursement 30 jours garanti
- ✅ Livraison instantanée < 5 min
- ✅ Support WhatsApp 24h/7j

👉 **[Commandez maintenant via WhatsApp](https://wa.me/33XXXXXXXXX)** — Test gratuit 24h sans carte bancaire.
`,

  'how-to-install': (kw, site) => `
## Comment Installer ${capitalize(kw)} ?

### Sur Amazon Firestick

1. Téléchargez l'application **Downloader** depuis l'App Store Amazon
2. Activez les sources inconnues : *Paramètres > Ma Fire TV > Options développeur*
3. Ouvrez Downloader et entrez le code : **1989448**
4. Installez l'APK Atlas Pro
5. Lancez l'application et entrez vos identifiants

### Sur Android / Smartphone

1. Activez *Sources inconnues* dans les paramètres
2. Téléchargez directement l'APK Atlas Pro depuis notre site
3. Installez et entrez vos identifiants

### Sur Smart TV (Samsung, LG)

- **Samsung (Tizen)** : App Store > "IPTV Smarters Pro"
- **LG (WebOS)** : App Store > "Smarters Player"
- **Android TV** : "TiviMate" + votre lien M3U

### Sur iPhone / iPad

1. App Store > Téléchargez **"Smarters Player Lite"**
2. Ajoutez votre abonnement (Xtream Codes)
3. Profitez de +15 000 chaînes

📞 **Besoin d'aide ?** Notre équipe vous guide en direct sur [WhatsApp](https://wa.me/33XXXXXXXXX).
`,

  faq: (kw, site) => `
## Questions Fréquentes sur ${capitalize(kw)}

**❓ Est-ce que ${site.name} est légal ?**
${site.name} est un service de streaming légal. Nous ne distribuons aucun contenu piraté.

**❓ Quelle connexion Internet faut-il ?**
Pour la HD : 10 Mbps minimum. Pour la 4K : 25 Mbps recommandés. Nos serveurs tournent en **+100 Mbps** garanti côté infrastructure pour une diffusion sans buffer.

**❓ Puis-je tester avant d'acheter ?**
Oui ! Nous offrons un **essai gratuit de 24 heures** sans carte bancaire.

**❓ Sur combien d'appareils puis-je regarder ?**
Selon votre formule : 1 (Starter), 2 (Premium) ou 3 (Ultimate) appareils simultanément.

**❓ Que se passe-t-il si ça ne fonctionne pas ?**
Remboursement intégral garanti sous 30 jours, sans justification.

**❓ Comment contacter le support ?**
Via WhatsApp 24h/7j. Réponse en moins de 5 minutes en français.
`,

  conclusion: (kw, site) => `
## Conclusion

${capitalize(kw)} est sans conteste l'une des meilleures solutions de streaming TV en France en ${new Date().getFullYear()}. Avec **${site.name}**, vous bénéficiez d'un service complet, fiable et abordable avec un support client exemplaire.

**Ce qu'il faut retenir :**
- 🏆 N°1 IPTV France avec 50 000+ abonnés
- 📺 +15 000 chaînes HD/4K + +70 000 VOD
- ⚡ 99.9% disponibilité garantie
- 💰 À partir de 3,33€/mois seulement
- 🆓 Essai gratuit 24h sans engagement

**Prêt à essayer ?** [Contactez-nous sur WhatsApp](https://wa.me/33XXXXXXXXX) pour votre test gratuit 24h — sans carte bancaire, sans engagement.
`,

  verdict: (kw, site) => `
## Notre Verdict Final

Après avoir testé ${capitalize(kw)} en conditions réelles pendant plusieurs semaines, notre verdict est clair : **${site.name} est le meilleur service IPTV disponible en France en ${new Date().getFullYear()}**.

### Points Forts ✅
- Qualité vidéo excellente (4K UHD sans buffer)
- Catalogue immense (+15 000 chaînes)
- Stabilité remarquable (99.9% uptime vérifié)
- Support client réactif (< 5 min WhatsApp)
- Prix très compétitif (3,33€/mois)

### Points Faibles ❌
- Nécessite une bonne connexion Internet (>10 Mbps)
- Application iOS nécessite Smarters Player

### Note Globale : ⭐⭐⭐⭐⭐ 4.8/5

**[→ Commencer l'essai gratuit 24h](https://wa.me/33XXXXXXXXX)**
`,
};

// ─── Backlink Directories ─────────────────────────────────
// Sites où soumettre des backlinks pour le niche IPTV/Streaming France
export const BACKLINK_DIRECTORIES = [
  // Annuaires généralistes FR
  { name: 'Annuaire-Gratuit.fr',    url: 'https://www.annuaire-gratuit.fr',        type: 'directory', lang: 'fr', da: 35, status: 'pending'   },
  { name: 'Annuaire.be',             url: 'https://www.annuaire.be',                type: 'directory', lang: 'fr', da: 28, status: 'pending'   },
  { name: 'Gimpsy.com',              url: 'https://www.gimpsy.com',                 type: 'directory', lang: 'fr', da: 30, status: 'pending'   },
  { name: 'VousêtesIci',             url: 'https://www.vouseteici.fr',              type: 'directory', lang: 'fr', da: 24, status: 'pending'   },
  { name: 'Annuaire-Web.fr',         url: 'https://www.annuaire-web.fr',            type: 'directory', lang: 'fr', da: 22, status: 'pending'   },
  // Tech / streaming forums
  { name: 'Reddit r/iptv',           url: 'https://www.reddit.com/r/iptv',          type: 'forum',     lang: 'en', da: 91, status: 'pending'   },
  { name: 'Reddit r/France',         url: 'https://www.reddit.com/r/france',        type: 'forum',     lang: 'fr', da: 91, status: 'pending'   },
  { name: 'Forum.hardware.fr',       url: 'https://forum.hardware.fr',              type: 'forum',     lang: 'fr', da: 62, status: 'pending'   },
  { name: 'Forum.ubuntu-fr.org',     url: 'https://forum.ubuntu-fr.org',            type: 'forum',     lang: 'fr', da: 58, status: 'pending'   },
  { name: 'Commentcamarche.net',     url: 'https://www.commentcamarche.net',        type: 'forum',     lang: 'fr', da: 72, status: 'pending'   },
  // Social profiles (powerful for brand backlinks)
  { name: 'Pinterest',               url: 'https://www.pinterest.fr',               type: 'social',    lang: 'fr', da: 94, status: 'pending'   },
  { name: 'Medium.com',              url: 'https://medium.com',                     type: 'blog',      lang: 'en', da: 96, status: 'pending'   },
  { name: 'Blogger.com',             url: 'https://www.blogger.com',                type: 'blog',      lang: 'fr', da: 87, status: 'pending'   },
  { name: 'WordPress.com',           url: 'https://wordpress.com',                  type: 'blog',      lang: 'fr', da: 95, status: 'pending'   },
  { name: 'Tumblr.com',              url: 'https://www.tumblr.com',                 type: 'blog',      lang: 'fr', da: 90, status: 'pending'   },
  // Press release / article sites
  { name: '1TPE.com',                url: 'https://www.1tpe.com',                   type: 'affiliate', lang: 'fr', da: 38, status: 'pending'   },
  { name: 'Publiteca.fr',            url: 'https://www.publiteca.fr',               type: 'press',     lang: 'fr', da: 26, status: 'pending'   },
  { name: 'Referencement-Web.org',   url: 'https://www.referencement-web.org',      type: 'seo',       lang: 'fr', da: 30, status: 'pending'   },
  // Q&A sites
  { name: 'Quora.com (FR)',          url: 'https://fr.quora.com',                   type: 'qa',        lang: 'fr', da: 91, status: 'pending'   },
  { name: 'Yahoo Answers (FR)',       url: 'https://fr.answers.yahoo.com',           type: 'qa',        lang: 'fr', da: 79, status: 'pending'   },
  // Streaming / tech niche
  { name: 'Koreus.com',              url: 'https://www.koreus.com',                 type: 'media',     lang: 'fr', da: 54, status: 'pending'   },
  { name: 'Clubic.com',              url: 'https://www.clubic.com',                 type: 'tech',      lang: 'fr', da: 76, status: 'pending'   },
  { name: 'Tomsguide.fr',            url: 'https://www.tomsguide.fr',               type: 'tech',      lang: 'fr', da: 70, status: 'pending'   },
];

// ─── Scheduled Blog Topics Queue ─────────────────────────
// Keywords queued for blog generation (one per run)
export const BLOG_QUEUE = [
  { kw: 'iptv france 2026',              template: 'guide-complet'    },
  { kw: 'atlas pro ontv',                template: 'test-avis'        },
  { kw: 'meilleur abonnement iptv',      template: 'meilleur-2026'    },
  { kw: 'firestick iptv installation',   template: 'installation-guide' },
  { kw: 'abonnement iptv prix',          template: 'prix-abonnement'  },
  { kw: 'iptv 4k france',               template: 'guide-complet'    },
  { kw: 'bein sports iptv france',       template: 'comparatif'       },
  { kw: 'iptv smarters france',          template: 'installation-guide' },
  { kw: 'atlas pro 9x code downloader',  template: 'installation-guide' },
  { kw: 'iptv coupe du monde 2026',      template: 'guide-complet'    },
  { kw: 'smart tv iptv samsung lg',      template: 'installation-guide' },
  { kw: 'iptv essai gratuit 24h',        template: 'test-avis'        },
  { kw: 'mag iptv portail stalker',      template: 'installation-guide' },
  { kw: 'iptv chaînes arabes france',    template: 'comparatif'       },
  { kw: 'atlas pro ontv avis clients',   template: 'test-avis'        },
  { kw: 'iptv vod films series 4k',      template: 'guide-complet'    },
  { kw: 'iptv android france',           template: 'installation-guide' },
  { kw: 'iptv sans coupure anti-freeze', template: 'guide-complet'    },
  { kw: 'xtream codes iptv france',      template: 'installation-guide' },
  { kw: 'abonnement iptv remboursement', template: 'comparatif'       },
  { kw: 'iptv serveur rapide 100 mbps',  template: 'guide-complet'    },
  { kw: 'iptv débit rapide sans buffer', template: 'guide-complet'    },
  { kw: 'iptv vitesse connexion 100mb',  template: 'test-avis'        },
];

// ─── Helpers ──────────────────────────────────────────────
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
