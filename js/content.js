/* ==========================================================================
   SITE CONTENT: edit this one file to update reels, stats and credits.
   --------------------------------------------------------------------------
   - Anything starting with "TODO" or "REEL_URL_" / "YT_URL_" is a placeholder.
     Placeholder links are rendered as non-clickable "Coming soon" cards, so
     the live site never shows a broken link.
   - On localhost, placeholder cards also get a visible red "TODO" badge.
   - thumb: path to a 9:16 .webp image (e.g. "images/reels/modern-day-pharaohs.webp")
   - video: optional path to a short, muted .mp4 preview (plays only in view,
     never with sound). Leave null to use the thumbnail + play icon.
   ========================================================================== */

window.SITE = {
    name: 'Youssef Elmonier',
    handle: '@jou.png',
    location: 'Egypt',
    email: 'youssifelmonier66@gmail.com',
    instagram: 'https://www.instagram.com/jou.png/',
    behance: 'https://www.behance.net/youssefelmonier',
    linkedin: 'https://www.linkedin.com/in/youssef-elmonier-1a670020b/',
    whatsapp: 'https://wa.me/qr/JZ3OAP5EOO3KI1',
    github: 'https://github.com/YoussefElmonier',

    // TODO: update the follower count. This single value is shown everywhere on the site.
    instagramFollowers: '1400+',

    // TODO: add the path to your CV file (e.g. "/files/Youssef-Elmonier-CV.pdf").
    // The old site had this Google Drive link stuck in the wrong attribute; paste it
    // here if it is still the right file:
    // https://drive.google.com/file/d/1rCvtq3se5HZGZ5EuYxnOCvA9tLct-zKs/view?usp=sharing
    cvUrl: '',

    // Stats line under "Featured AI Reels" (edit freely).
    topReel: {
        title: 'Modern Day Pharaohs',
        views: '180K',
        likes: '11.6K',
        shares: '3.2K'
    },

    totalReels: {
        views: '250K',
        likes: '25K',
        shares: '7K'
    }
};

/* --------------------------------------------------------------------------
   FEATURED AI REELS (homepage + reels page)
   Add a reel by copying one object and changing the values.
   -------------------------------------------------------------------------- */
window.REELS = [
    {
        title: 'NEW ERA',
        description: 'Creator meets character: introducing the Pharaoh universe.',
        url: 'https://www.instagram.com/jou.png/reel/Dd4Vr4LxINM/',
        thumb: 'images/webp/reel-cover-mine.webp',
        video: null,
        tag: 'Creator · AI'
    },
    {
        title: 'Modern Day Pharaohs',
        description: 'Ancient traditions meet modern tech in the desert.',
        url: 'https://www.instagram.com/reel/Dd7-LGPIHHd/?stkn=Yzl2ajM0MnR2NTU4',
        thumb: 'images/webp/reel1.webp',
        video: null,
        tag: 'Viral · 180K'
    },
    {
        title: 'Day in KEMET',
        description: 'Handheld phone-footage of a Pharaoh cruising through ancient Kemet.',
        url: 'https://www.instagram.com/reel/DeBek6DMeET/?stkn=NXA2YzYybmM1M24z',
        thumb: 'images/webp/reel2.webp',
        video: null,
        tag: 'AI Film'
    },
    {
        title: 'Good Old Days',
        description: 'A pharaoh takes a jetpack for a spin over ancient Egypt.',
        url: 'https://www.instagram.com/reel/Dd_ZPrAoRna/?stkn=MW9oMjJka2Q1NGR1eQ==',
        thumb: 'images/webp/reel3.webp',
        video: null,
        tag: 'AI Film'
    },
    {
        title: 'Zarzour × Vito Corleone',
        description: 'Egyptian cinema heritage meets classic Hollywood mafia icon.',
        url: 'https://www.instagram.com/p/Dd5nMYIIPhY/',
        thumb: 'images/webp/reel4.webp',
        video: null,
        tag: 'Cinema AI'
    },
    {
        title: 'They Never Really Left',
        description: 'Ancient mummy sharing tea and tawla at a local Cairo street café.',
        url: 'https://www.instagram.com/p/DeEIUKCI4uP/',
        thumb: 'images/webp/reel5.webp',
        video: null,
        tag: 'Higgsfield AI'
    },
    {
        title: 'Mummified The Drip',
        description: 'Ancient royalty meets modern streetwear: iced-out grillz and counting cash.',
        url: 'https://www.instagram.com/p/DeHpzBsIszr/',
        thumb: 'images/webp/reel6.webp',
        video: null,
        tag: 'Higgsfield AI'
    }
];

/* --------------------------------------------------------------------------
   CREDITED VISUAL WORK: official releases (homepage)
   youtube: main link. behance: optional secondary "case study" link.
   -------------------------------------------------------------------------- */
window.CREDITS = [
    {
        artist: 'Moscow × Nasser',
        title: 'Meen Ytafy Nary',
        role: 'Official AI Stop-Motion Visualizer',
        description: 'Stop-motion visualizer built from AI-generated image sequences, plus the vertical Spotify Canvas.',
        youtube: 'https://www.youtube.com/watch?v=WPwWp-UeD1w',
        behance: null,
        thumb: 'images/webp/myn.webp'
    },
    {
        artist: 'Abyusif',
        title: 'GRRR',
        role: 'Official 3D Visualizer',
        description: 'Fully immersive 3D visualizer for the Egyptian rap legend. Modeled in Blender, edited in Premiere.',
        youtube: 'YT_URL_2', // TODO: add the official YouTube link
        behance: 'https://www.behance.net/gallery/198939571/Official-3D-Visuals-for-Abyusif-Grrr-Official-Artwork',
        thumb: 'images/webp/grr.webp'
    },
    {
        artist: 'Moscow',
        title: 'Monalisa',
        role: 'Official 3D Visualizer',
        description: 'One Blender scene, two worlds: a vintage half and a futuristic half, blended seamlessly.',
        youtube: 'https://www.youtube.com/watch?v=Nwe9s2wMqIQ',
        behance: 'https://www.behance.net/gallery/201141085/Moscow-Monalisa-Official-3D-Visualizer',
        thumb: 'images/webp/MonalisaYTB.webp'
    },
    {
        artist: 'Dezel Uzi',
        title: 'Mourad (EP)',
        role: '3D Visuals & Artwork',
        description: 'A 3D museum environment built in Blender to capture the themes and mood of the EP.',
        youtube: 'YT_URL_4', // TODO: add the official YouTube link
        behance: 'https://www.behance.net/gallery/198938963/Dezel-Uzi-EP-Cover-Using-3D-Blender',
        thumb: 'images/webp/uzi.webp'
    },
    {
        artist: '3abaz',
        title: 'Feen El E7sas',
        role: '3D CGI & VFX',
        description: 'CGI 3D plushies composited into live-action footage for the official music video.',
        youtube: 'https://www.youtube.com/watch?v=qHeQ29m_9v4',
        behance: null,
        thumb: 'images/webp/3ab3az.webp'
    },
    {
        artist: 'Bee Group',
        title: 'Eid Ad',
        role: 'CGI & 3D',
        description: 'CGI/VFX ad for the Eid campaign. 3D in Blender, post-production in DaVinci Resolve.',
        youtube: 'YT_URL_6', // TODO: add the official YouTube link
        behance: 'https://www.behance.net/gallery/201141333/Bee-Group-Eid-Ad-VFX',
        thumb: 'images/webp/bee.webp'
    }
];

/* --------------------------------------------------------------------------
   3D / CGI MOTION REELS (reels page, below the AI reels)
   -------------------------------------------------------------------------- */
window.MOTION_REELS = [
    {
        title: 'JPNG 2024 Recap',
        description: 'A year of 3D, CGI and creative work condensed into one edit.',
        url: 'https://www.instagram.com/jou.png/reel/DENf7ZwIr05/',
        thumb: 'images/webp/logoW.webp',
        video: 'videos/optimized/RECAP24.mp4',
        tag: 'Instagram'
    },
    {
        title: 'Abyusif: GRRR',
        description: 'Official 3D visualizer, modeled and rendered in Blender.',
        url: 'https://www.behance.net/gallery/198939571/Official-3D-Visuals-for-Abyusif-Grrr-Official-Artwork',
        thumb: 'images/webp/grr.webp',
        video: 'videos/optimized/manga222.mp4',
        tag: 'Behance'
    },
    {
        title: 'Moscow: Monalisa',
        description: 'Official 3D visualizer with a vintage/futuristic duality.',
        url: 'https://www.youtube.com/watch?v=Nwe9s2wMqIQ',
        thumb: 'images/webp/MonalisaYTB.webp',
        video: 'videos/optimized/manga2.mp4',
        tag: 'YouTube'
    },
    {
        title: 'Bee Group Eid Ad',
        description: 'CGI/VFX ad. Blender 3D, DaVinci Resolve post.',
        url: 'https://www.instagram.com/p/DHyGnonCb85/',
        thumb: 'images/webp/bee.webp',
        video: 'videos/optimized/bee_group.mp4',
        tag: 'Instagram'
    },
    {
        title: '3abaz: Feen El E7sas',
        description: '3D plushies composited into live-action footage.',
        url: 'https://www.youtube.com/watch?v=qHeQ29m_9v4',
        thumb: 'images/webp/3ab3az.webp',
        video: 'videos/optimized/feenele7sas.mp4',
        tag: 'YouTube'
    },
    {
        title: 'Moscow × Nasser: MYN',
        description: 'Stop-motion visualizer from AI-generated image sequences.',
        url: 'https://www.youtube.com/watch?v=WPwWp-UeD1w',
        thumb: 'images/webp/myn.webp',
        video: 'videos/optimized/myn.mp4',
        tag: 'YouTube'
    }
];
