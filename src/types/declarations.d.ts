declare module 'cloudinary' {
  const cloudinary: any;
  export default cloudinary;
}

declare module 'express-fileupload' {
  import { RequestHandler } from 'express';
  function fileUpload(options?: any): RequestHandler;
  export = fileUpload;
}
