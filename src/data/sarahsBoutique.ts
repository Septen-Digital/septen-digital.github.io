import boutiqueHeroImage from '../assets/demo-images/sarahs-boutique/hero.webp';
import boutiqueStoreImage from '../assets/demo-images/sarahs-boutique/store.webp';
import seraphinaImage from '../assets/demo-images/sarahs-boutique/seraphina-raw-silk-maxi.webp';
import cameloreImage from '../assets/demo-images/sarahs-boutique/camelore-cashmere-trench.webp';
import helenaImage from '../assets/demo-images/sarahs-boutique/helena-ribbed-wool-midi.webp';
import noorImage from '../assets/demo-images/sarahs-boutique/noor-yorkshire-cocoon-coat.webp';
import sylviaImage from '../assets/demo-images/sarahs-boutique/sylvia-linen-smock-shirt.webp';
import auraImage from '../assets/demo-images/sarahs-boutique/aura-fine-merino-turtleneck.webp';
import montpellierImage from '../assets/demo-images/sarahs-boutique/montpellier-suede-bucket-bag.webp';
import lichenImage from '../assets/demo-images/sarahs-boutique/lichen-fringe-british-scarf.webp';
import northSeaImage from '../assets/demo-images/sarahs-boutique/north-sea-guernsey-cape.webp';

export type SarahsBoutiqueView = 'home' | 'catalogue' | 'product-detail' | 'about' | 'visit';

export type SarahsBoutiqueProduct = {
  id: string;
  name: string;
  price: string;
  category: string;
  image: ImageMetadata;
  shortDesc: string;
  longDesc: string;
  sizing: string;
  materials: string;
};

export const sarahsBoutiqueHeroImage = boutiqueHeroImage;
export const sarahsBoutiqueStoreImage = boutiqueStoreImage;

export const sarahsBoutiqueInventory: SarahsBoutiqueProduct[] = [
  {
    id: 'prod-1',
    name: 'Seraphina Raw Silk Maxi',
    price: '£195.00',
    category: 'Dresses',
    image: seraphinaImage,
    shortDesc: 'Effortless flowing maxi dress in pure organic silk with fluid drapery.',
    longDesc:
      'Crafted from double-washed raw Mulberry silk, the Seraphina Maxi presents a simple, unstructured drape that floats with movement. Features a delicate boat neckline, hidden side-seam pockets, and raw-rolled edge hemlines that soften with age. Every piece is hand-finished in our northern studio.',
    sizing: `True to size. Fits loosely through hips. Model is 5'9" and wears a size S (UK 8-10).`,
    materials: '100% Organic Raw Mulberry Silk, natural lichen pigment wash.',
  },
  {
    id: 'prod-2',
    name: 'Camelore Cashmere Trench',
    price: '£340.00',
    category: 'Outerwear',
    image: cameloreImage,
    shortDesc: 'Tailored double-breasted coat made of premium Italian cashmere.',
    longDesc:
      'Our signature silhouette for the cold seasons. This double-breasted trench is structured from heavy-gauge recycled Italian cashmere. Lined with natural flax satin, it maintains heat without unnecessary weight. Detailed with hand-carved horn buttons and an optional tie belt.',
    sizing: 'Relaxed tailored cut. Designed for layering over thick knitwear. Model is 5\'10" and wears size M.',
    materials: '90% Recycled Cashmere, 10% Extra-fine Merino Wool, 100% Bio-degradable flax lining.',
  },
  {
    id: 'prod-3',
    name: 'Helena Ribbed Wool Midi',
    price: '£160.00',
    category: 'Dresses',
    image: helenaImage,
    shortDesc: 'Finely-ribbed wool blend with subtle back split and high mock neck.',
    longDesc:
      'The Helena mock neck dress is woven in an extra-fine rib stitch to contour comfort. Featuring a supportive weight that holds its structured silhouette flawlessly, completed with a functional mid-rise side ventilation slit.',
    sizing: 'Form-fitting with moderate stretch. Take your normal size.',
    materials: '70% Merino Wool, 30% Long-staple Egyptian Cotton.',
  },
  {
    id: 'prod-4',
    name: 'Noor Yorkshire Cocoon Coat',
    price: '£280.00',
    category: 'Outerwear',
    image: noorImage,
    shortDesc: 'Sculpted oversized cocoon coat crafted in thick Yorkshire felted wool.',
    longDesc:
      'An architectural statement piece. The Noor Coat leverages the robust strength of structured Yorkshire sheep wool, boiled gently to establish a windproof density. Features slouchy drop-shoulder curves and deep inset envelope pockets.',
    sizing: 'Intentionally oversized. If you prefer a closer fit, please size down.',
    materials: '100% British Boiled Wool, sourced and processed locally.',
  },
  {
    id: 'prod-5',
    name: 'Sylvia Linen Smock Shirt',
    price: '£110.00',
    category: 'Tops',
    image: sylviaImage,
    shortDesc: 'Relaxed button-down utility shirt styled with French-seam cuffs.',
    longDesc:
      'Inspired by traditional artist workwear, the Sylvia smock is pre-softened with natural stone-washing. Styled with subtle front button closures and breathable underarm gussets, offering robust multi-seasonal wear.',
    sizing: 'Generous utility cut. Model is wears size S for a relaxed style.',
    materials: '100% Belgian Flax Linen, stone-washed for texture.',
  },
  {
    id: 'prod-6',
    name: 'Aura Fine Merino Turtleneck',
    price: '£135.00',
    category: 'Tops',
    image: auraImage,
    shortDesc: 'Feather-light merino turtleneck with clean rolled-edge accents.',
    longDesc:
      'A core base piece for any cold day collection. We use spun premium wool fibers that do not bite. Extraordinarily fine, breathable, and designed to sit softly against skin with refined seamless wrist borders.',
    sizing: 'Closer performance fit. Wear under coats or smocks.',
    materials: '100% Super-fine Australian Merino Wool.',
  },
  {
    id: 'prod-7',
    name: 'Montpellier Suede Bucket Bag',
    price: '£210.00',
    category: 'Accessories',
    image: montpellierImage,
    shortDesc: 'Raw-edged luxury suede shoulder bag with solid hand-carved brass clasps.',
    longDesc:
      'Our hallmark leather bag. Generous split-grain suede detailed with an unlined raw interior, exposing organic leather suede grains. Contains an internal zipped linen pouch for secure telephone and card storage.',
    sizing: 'One size. Measures 32cm high, 24cm deep, shoulder drop 34cm.',
    materials: '100% Tuscan Cowhide Suede, solid cast brass buckles.',
  },
  {
    id: 'prod-8',
    name: 'Lichen Fringe British Scarf',
    price: '£65.00',
    category: 'Accessories',
    image: lichenImage,
    shortDesc: 'Hand-brushed wool scarf colored with natural moss pigment extracts.',
    longDesc:
      'Woven in Yorkshire on traditional looms, then gently brushed with hand-teasels to lift natural fluff. Colored with chemical-free forest moss dyes, yielding deep melange sage and olive complexities.',
    sizing: 'Unisex. Length 190cm, width 45cm.',
    materials: '100% Virgin Lambswool, processed in botanical baths.',
  },
  {
    id: 'prod-9',
    name: 'North Sea Guernsey Cape',
    price: '£225.00',
    category: 'Collections',
    image: northSeaImage,
    shortDesc: 'Traditional heavy wool knit cape with high structural windproof storm collar.',
    longDesc:
      'A stunning heavy-weight knitted outer-layer designed to resist sea breeze. Modeled on standard fishermen garments, utilizing double-twisted wool to maximize rainwater deflection.',
    sizing: 'Oversized. One size fits UK sizes 8 through 18 comfortably.',
    materials: '100% Double-twisted worsted sheep wool.',
  },
];

export const sarahsBoutiqueCategories = ['All', 'Dresses', 'Outerwear', 'Tops', 'Accessories', 'Collections'] as const;
export const sarahsBoutiqueFeaturedProducts = sarahsBoutiqueInventory.slice(0, 3);
