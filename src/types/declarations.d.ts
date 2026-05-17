declare module 'mongoose' {
  class Schema {
    static Types: {
      ObjectId: any;
      Mixed: any;
    };
    constructor(definition: any, options?: any);
    plugin(fn: any, opts?: any): this;
    methods: any;
    index(fields: any, options?: any): this;
  }

  interface Model {
    new(doc?: any): any;
    find(filter?: any, projection?: any, options?: any, callback?: any): any;
    findById(id: any, projection?: any, options?: any, callback?: any): any;
    findByIdAndUpdate(id: any, update: any, options?: any, callback?: any): any;
    findByIdAndDelete(id: any, callback?: any): any;
    findOne(filter: any, callback?: any): any;
    countDocuments(filter?: any, callback?: any): any;
    create(doc: any, callback?: any): any;
  }

  interface Document {
    _id: any;
    id: string;
    save(callback?: any): any;
    toObject(): any;
    toJSON(): any;
  }

  function model(name: string, schema?: Schema, collection?: string): any;
  function connect(uri: string, options?: any): Promise<any>;
  function disconnect(): Promise<void>;
  let Promise: any;
  const connection: {
    collections: Record<string, { deleteMany(filter?: any): Promise<any> }>;
  };
}

declare module 'mongoose-unique-validator' {
  function uniqueValidator(schema: any, options?: any): void;
  export = uniqueValidator;
}

declare module 'cloudinary' {
  const cloudinary: any;
  export default cloudinary;
}

declare module 'express-fileupload' {
  import { RequestHandler } from 'express';
  function fileUpload(options?: any): RequestHandler;
  export = fileUpload;
}
