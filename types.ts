export enum Category {
  REGULATIONS = '規章制度',
  FLOWCHARTS = '粒子流程表',
  FORMS = '共用表格',
  JOB_DESCRIPTIONS = '職務說明書',
}

export interface DocumentItem {
  id: string; // Google Drive ID or unique identifier
  title: string;
  description: string; // Purpose/Description of the file
  date: string;
  category: Category;
  subCategory: string; // e.g., '組織系列', '一部門'
  googleDriveId?: string; // Optional: separate ID if different from main ID
}

export type SubCategoryMap = {
  [key in Category]: string[];
};

export const SUB_CATEGORIES: SubCategoryMap = {
  [Category.REGULATIONS]: [
    '組織系列',
    '技術系列',
    '財務系列',
    '行銷系列',
    '品格系列'
  ],
  [Category.FLOWCHARTS]: [
    '一部門',
    '二部門',
    '三部門',
    '四部門',
    '五部門',
    '六部門',
    '七部門'
  ],
  [Category.FORMS]: [
    '人事相關',
    '公關相關',
    '文書檔案',
    '印鑑相關',
    '財務相關',
    '管理相關',
    '穩盈相關'
  ],
  [Category.JOB_DESCRIPTIONS]: [
    '一部門',
    '二部門',
    '三部門',
    '四部門',
    '五部門',
    '七部門'
  ]
};