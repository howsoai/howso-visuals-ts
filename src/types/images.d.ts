declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const value: any;
  export = value;
}

declare module "*.png" {
  const value: any;
  export = value;
}
