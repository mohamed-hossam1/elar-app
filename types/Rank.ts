export type RankMode = 'category' | 'top_selling' | 'new_arrival';

export interface RankedProduct {
  id: string;
  title: string;
  image_cover: string;
  rank: number | null;
}

export interface RankUpdateItem {
  id: string;
  rank: number | null;
}

export interface RankUpdateRequest {
  mode: RankMode;
  products: RankUpdateItem[];
}
