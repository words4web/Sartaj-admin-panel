import { TranslationField } from "@/components/common/TranslationInput";

export const PRODUCT_BADGES = {
  FEATURED: "featured",
  HOT: "hot",
  NEW_ARRIVAL: "new_arrival",
} as const;

export type ProductBadge = (typeof PRODUCT_BADGES)[keyof typeof PRODUCT_BADGES];

export const PRODUCT_UNIT = {
  LITER: "liter",
  GRAM: "gram",
  KG: "kg",
  PIECE: "piece",
} as const;
export type ProductUnit = (typeof PRODUCT_UNIT)[keyof typeof PRODUCT_UNIT];

export const PRODUCT_TYPE = {
  DRY: "DRY",
  FROZEN: "FROZEN",
} as const;
export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

export const SELLING_UNIT = {
  CASE: "case",
  UNIT: "unit",
} as const;
export type SellingUnit = (typeof SELLING_UNIT)[keyof typeof SELLING_UNIT];

export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
} as const;
export type StockStatus = (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];

export const PRODUCT_TAG = {
  VEG: "veg",
  HALAL: "halal",
  VEGAN: "vegan",
  JAIN_FOOD: "jain food",
} as const;
export type ProductTag = (typeof PRODUCT_TAG)[keyof typeof PRODUCT_TAG];

export const PRODUCT_CASE_TYPE = {
  BOTTLE: "bottle",
  TIN: "tin",
  BAG: "bag",
  BOX: "box",
  PACKET: "packet",
} as const;
export type ProductCaseType =
  (typeof PRODUCT_CASE_TYPE)[keyof typeof PRODUCT_CASE_TYPE];

export const PRODUCT_BADGE_OPTIONS: {
  key: ProductBadge;
  label: string;
}[] = [
  { key: PRODUCT_BADGES.FEATURED, label: "Featured" },
  { key: PRODUCT_BADGES.HOT, label: "Hot" },
  { key: PRODUCT_BADGES.NEW_ARRIVAL, label: "New arrival" },
];

export const PRODUCT_TAGS: { key: ProductTag; label: string }[] = [
  { key: PRODUCT_TAG.VEG, label: "Veg" },
  { key: PRODUCT_TAG.HALAL, label: "Halal" },
  { key: PRODUCT_TAG.VEGAN, label: "Vegan" },
  { key: PRODUCT_TAG.JAIN_FOOD, label: "Jain Food" },
];

export const PRODUCT_CASE_TYPE_OPTIONS: {
  key: ProductCaseType;
  label: string;
}[] = [
  { key: PRODUCT_CASE_TYPE.BOTTLE, label: "Bottle" },
  { key: PRODUCT_CASE_TYPE.TIN, label: "Tin" },
  { key: PRODUCT_CASE_TYPE.BAG, label: "Bag" },
  { key: PRODUCT_CASE_TYPE.BOX, label: "Box" },
  { key: PRODUCT_CASE_TYPE.PACKET, label: "Packet" },
];

export const PRODUCT_UNITS: { key: ProductUnit; label: string }[] = [
  { key: PRODUCT_UNIT.LITER, label: "Liter" },
  { key: PRODUCT_UNIT.GRAM, label: "Gram" },
  { key: PRODUCT_UNIT.KG, label: "Kg" },
  { key: PRODUCT_UNIT.PIECE, label: "Piece" },
];

export const PRODUCT_TYPES: { key: ProductType; label: string }[] = [
  { key: PRODUCT_TYPE.DRY, label: "DRY" },
  { key: PRODUCT_TYPE.FROZEN, label: "FROZEN" },
];

export const SELLING_UNITS: { key: SellingUnit; label: string }[] = [
  { key: SELLING_UNIT.UNIT, label: "Unit" },
  { key: SELLING_UNIT.CASE, label: "Case" },
];

export const STOCK_STATUSES: { key: StockStatus; label: string }[] = [
  { key: STOCK_STATUS.IN_STOCK, label: "In stock" },
  { key: STOCK_STATUS.OUT_OF_STOCK, label: "Out of stock" },
];

export const PRODUCT_FORM_STEPS = [
  { id: "basic", label: "Basic Info" },
  { id: "pricing", label: "Pricing & Catalog" },
  { id: "packaging", label: "Packaging & Stock" },
] as const;

export const PRODUCT_FORM_VALIDATION_HINTS: Record<number, string> = {
  0: "Fill in all language names, descriptions, item code, slug and upload an image.",
  1: "Select at least one segment with a price > 0, set category/manufacturer, and verify tax configuration.",
  2: "Fill in all packaging and inventory fields.",
};

export const PRODUCT_BASIC_INFO_FIELDS: TranslationField[] = [
  {
    key: "name",
    label: "Product name",
    required: true,
    placeholder: "Short product title",
  },
  {
    key: "description",
    label: "Description",
    required: true,
    richText: true,
    multiline: true,
    rows: 3,
    resizeVertical: true,
    placeholder: "Full description for catalogs",
    disclaimer:
      "Disclaimer: Please do not modify the default subheading names or structure. Only edit the placeholder text under them. Modifying headings will break the product detail section and collapsible features on the retailer website.",
  },
];

export const DEFAULT_DESCRIPTION_TEMPLATES: Record<string, string> = {
  en: `<p>[Enter product introduction here...]</p>
<p><br></p>
<p><strong>Flavour Profile</strong></p>
<p>[Enter flavour profile and taste details here...]</p>
<p><br></p>
<p><strong>Product Highlights</strong></p>
<ul>
  <li>[Highlight item 1]</li>
  <li>[Highlight item 2]</li>
</ul>
<p><br></p>
<table>
  <tbody>
    <tr>
      <td><strong>Diet Type</strong></td>
      <td>Vegetarian</td>
    </tr>
    <tr>
      <td><strong>Brand</strong></td>
      <td>Sartaj</td>
    </tr>
    <tr>
      <td><strong>Flavour</strong></td>
      <td>South Asian</td>
    </tr>
    <tr>
      <td><strong>Net Qty</strong></td>
      <td>400 g</td>
    </tr>
    <tr>
      <td><strong>Number of items</strong></td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p><strong>Key Ingredients</strong></p>
<ul>
  <li>[Ingredient 1]</li>
  <li>[Ingredient 2]</li>
</ul>
<p><br></p>
<p><strong>Added Colours</strong></p>
<p>[Yes/No, e.g. No artificial colours are added.]</p>
<p><br></p>
<p><strong>How to Use?</strong></p>
<p>[Enter preparation or cooking instructions here...]</p>`,

  ja: `<p>【ここに商品説明文を入力してください...】</p>
<p><br></p>
<p><strong>風味の特徴</strong></p>
<p>【風味や味わいの詳細を入力してください...】</p>
<p><br></p>
<p><strong>製品の特徴</strong></p>
<ul>
  <li>【製品の特徴1】</li>
  <li>【製品の特徴2】</li>
</ul>
<p><br></p>
<table>
  <tbody>
    <tr>
      <td><strong>食事タイプ</strong></td>
      <td>ベジタリアン</td>
    </tr>
    <tr>
      <td><strong>ブランド</strong></td>
      <td>Sartaj</td>
    </tr>
    <tr>
      <td><strong>風味</strong></td>
      <td>南アジア風</td>
    </tr>
    <tr>
      <td><strong>内容量</strong></td>
      <td>400 g</td>
    </tr>
    <tr>
      <td><strong>数量</strong></td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p><strong>主な原材料</strong></p>
<ul>
  <li>【原材料1】</li>
  <li>【原材料2】</li>
</ul>
<p><br></p>
<p><strong>着色料</strong></p>
<p>【例：人工着色料は使用していません。】</p>
<p><br></p>
<p><strong>使用方法</strong></p>
<p>【調理法や使用方法を入力してください...】</p>`,

  hi: `<p>[यहाँ उत्पाद का परिचय दर्ज करें...]</p>
<p><br></p>
<p><strong>स्वाद प्रोफ़ाइल</strong></p>
<p>[यहाँ स्वाद विवरण दर्ज करें...]</p>
<p><br></p>
<p><strong>उत्पाद मुख्य विशेषताएं</strong></p>
<ul>
  <li>[मुख्य विशेषता 1]</li>
  <li>[मुख्य विशेषता 2]</li>
</ul>
<p><br></p>
<table>
  <tbody>
    <tr>
      <td><strong>आहार प्रकार</strong></td>
      <td>शाकाहारी</td>
    </tr>
    <tr>
      <td><strong>ब्रांड</strong></td>
      <td>Sartaj</td>
    </tr>
    <tr>
      <td><strong>स्वाद</strong></td>
      <td>दक्षिण एशियाई</td>
    </tr>
    <tr>
      <td><strong>कुल मात्रा</strong></td>
      <td>400 g</td>
    </tr>
    <tr>
      <td><strong>आइटम संख्या</strong></td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p><strong>मुख्य सामग्री</strong></p>
<ul>
  <li>[सामग्री 1]</li>
  <li>[सामग्री 2]</li>
</ul>
<p><br></p>
<p><strong>अतिरिक्त रंग</strong></p>
<p>[उदा. कोई कृत्रिम रंग नहीं मिलाया गया है।]</p>
<p><br></p>
<p><strong>कैसे उपयोग करें?</strong></p>
<p>[यहाँ उपयोग करने का तरीका दर्ज करें...]</p>`,

  ne: `<p>[यहाँ उत्पादनको परिचय प्रविष्टि गर्नुहोस्...]</p>
<p><br></p>
<p><strong>स्वाद प्रोफाइल</strong></p>
<p>[यहाँ स्वाद विवरण प्रविष्टि गर्नुहोस्...]</p>
<p><br></p>
<p><strong>उत्पादन हाइलाइटहरू</strong></p>
<ul>
  <li>[हाइलाइट १]</li>
  <li>[हाइलाइट २]</li>
</ul>
<p><br></p>
<table>
  <tbody>
    <tr>
      <td><strong>आहार प्रकार</strong></td>
      <td>शाकाहारी</td>
    </tr>
    <tr>
      <td><strong>ब्रान्ड</strong></td>
      <td>Sartaj</td>
    </tr>
    <tr>
      <td><strong>स्वाद</strong></td>
      <td>दक्षिण एसियाली</td>
    </tr>
    <tr>
      <td><strong>कुल मात्रा</strong></td>
      <td>400 g</td>
    </tr>
    <tr>
      <td><strong>सामग्री संख्या</strong></td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p><strong>मुख्य सामग्रीहरू</strong></p>
<ul>
  <li>[सामग्री १]</li>
  <li>[सामग्री २]</li>
</ul>
<p><br></p>
<p><strong>थप रंगहरू</strong></p>
<p>[उदा. कुनै कृत्रिम रंगहरू थपिएको छैन।]</p>
<p><br></p>
<p><strong>कसरी प्रयोग गर्ने?</strong></p>
<p>[यहाँ प्रयोग गर्ने तरिका प्रविष्टि गर्नुहोस्...]</p>`,

  bn: `<p>[এখানে পণ্যের বিবরণ লিখুন...]</p>
<p><br></p>
<p><strong>ফ্লেভার প্রোফাইল</strong></p>
<p>[এখানে ফ্লেভার বিবরণ লিখুন...]</p>
<p><br></p>
<p><strong>পণ্য হাইলাইট</strong></p>
<ul>
  <li>[হাইলাইট ১]</li>
  <li>[হাইলাইট ২]</li>
</ul>
<p><br></p>
<table>
  <tbody>
    <tr>
      <td><strong>আহারের ধরণ</strong></td>
      <td>নিরামিষ</td>
    </tr>
    <tr>
      <td><strong>ব্র্যান্ড</strong></td>
      <td>Sartaj</td>
    </tr>
    <tr>
      <td><strong>ফ্লেভার</strong></td>
      <td>দক্ষিণ এশীয়</td>
    </tr>
    <tr>
      <td><strong>নিট ওজন</strong></td>
      <td>400 g</td>
    </tr>
    <tr>
      <td><strong>আইটেম সংখ্যা</strong></td>
      <td>1</td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p><strong>মূল উপাদান</strong></p>
<ul>
  <li>[উপাদান ১]</li>
  <li>[উপাদান ২]</li>
</ul>
<p><br></p>
<p><strong>যোগ করা রং</strong></p>
<p>[উদাঃ কোন কৃত্রিম রং যোগ করা হয়নি।]</p>
<p><br></p>
<p><strong>কিভাবে ব্যবহার করবেন?</strong></p>
<p>[এখানে ব্যবহারের নিয়ম লিখুন...]</p>`,
};
