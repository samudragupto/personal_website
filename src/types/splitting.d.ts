declare module "splitting" {
  type SplittingResult = {
    chars?: HTMLElement[];
    words?: HTMLElement[];
    el: HTMLElement;
  };

  type SplittingOptions = {
    target?: string | Element | Element[];
    by?: "chars" | "words" | string;
  };

  export default function Splitting(options?: SplittingOptions): SplittingResult[];
}