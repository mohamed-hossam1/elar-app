export const SEO_CONFIG = {
  SITE_NAME: "ELAR",
  SITE_URL: process.env.NEXT_PUBLIC_APP_URL || "https://elar.app",

  SITE_DESCRIPTION:
    "Shop men's clothing online in Egypt. Discover stylish outfits, casual wear, t-shirts, shirts, and pants with high-quality fabrics and modern designs. Fast delivery across Egypt.",

  LANGUAGE: "en-EG",
  REGION: "EG",

  SOCIAL_MEDIA: {
    FACEBOOK: "https://www.facebook.com/elar",
    INSTAGRAM: "https://www.instagram.com/elar",
    TWITTER: "https://www.twitter.com/elar",
  },

  CONTACT_EMAIL: "support@elar.app",
  PHONE: "+20 1013429234",

  DEFAULT_OG_IMAGE: "/logo.webp",

  DEFAULT_KEYWORDS: [
    "men's clothing Egypt",
    "men fashion Egypt",
    "buy men clothes online Egypt",
    "men t-shirts Egypt",
    "men shirts Egypt",
    "men pants Egypt",
    "casual wear men Egypt",
    "streetwear men Egypt",

    "ملابس رجالي",
    "ملابس رجالي مصر",
    "ملابس رجالي اونلاين",
    "تيشرتات رجالي",
    "تيشيرتات",
    "تي شيرتات",
    "تي شيرتات رجالى",
    "هودي رجالي",
    "هودي",
    "قمصان رجالي",
    "قمصان",
    "بنطلونات رجالي",
    "بنطلونات",
    "ستايل رجالي",
    "ستايل",
    "شراء ملابس رجالي اونلاين",
    "شراء ملابس رجالي",
    "ملابس رجالي كاجوال",
    "ملابس رجالي شبابي",
    "ملابس رجالي كلاسيك",
    "ملابس رجالي فورمال",
    "ملابس رجالي مقاسات كبيرة",
    "ملابس رجالي مقاسات كبيرة مصر",
    "ملابس رجالي مقاسات كبيرة اونلاين",
    "ملابس رجالي مقاسات كبيرة اونلاين مصر",
  ],


  ROBOTS_CONFIG: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  ROBOTS_DISALLOW: [
    "/admin",
    "/api",
    "/checkout",
    "/order-success",
    "/profile",
  ],

  ROBOTS_ALLOW: ["/", "/products", "/sign-in", "/sign-up", "/cart"],

  REVALIDATE_TIME: {
    DEFAULT: 3600,
    PRODUCTS: 1800,
    STATIC: 86400,
  },
};