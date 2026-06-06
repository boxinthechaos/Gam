export type Category = 'food' | 'hotel' | 'tour';
 
export interface Place {
    id: number;
    name: string;
    address: string;
    category: Category;
    lat: number;
    lng: number;
}
 