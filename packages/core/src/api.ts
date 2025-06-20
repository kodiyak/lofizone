export namespace Api {
  export interface Verse {
    id: string;
    audio?: string | null;
    text: string;
    number: number;
  }
}
