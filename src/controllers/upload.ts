import { Response } from 'express';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import r2, { R2_BUCKET, R2_PUBLIC_URL_PREFIX } from '../lib/r2';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../types';

interface UploadedFile {
  name: string;
  data: Buffer;
}

const asString = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? v[0] : v || '';

const EXTENSIONES_VALIDAS = ['png', 'jpg', 'gif', 'jpeg'];

const contentTypeMap: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
};

const getContentType = (ext: string): string =>
  contentTypeMap[ext] || 'application/octet-stream';

const uploadToR2 = async (buffer: Buffer, key: string, contentType: string) => {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
};

const deleteFromR2 = async (key: string) => {
  try {
    await r2.send(
      new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }),
    );
  } catch (err) {
    console.error('Error deleting from R2:', err);
  }
};

const extractKeyFromUrl = (url: string): string | null => {
  if (!url || !url.startsWith(R2_PUBLIC_URL_PREFIX)) return null;
  return url.slice(R2_PUBLIC_URL_PREFIX.length + 1);
};

const updateEntityImage = async (
  model: { findUnique: Function; update: Function },
  id: string,
  key: string,
  urlImagen: string,
  entityKey: string,
  res: Response,
) => {
  try {
    const entity = await model.findUnique({ where: { id } });

    if (!entity) {
      await deleteFromR2(key);
      return res.status(400).send({
        ok: false,
        err: { message: `La entidad no existe` },
      });
    }

    const oldKey = extractKeyFromUrl(entity.image || '');
    if (oldKey) {
      await deleteFromR2(oldKey);
    }

    const updated = await model.update({
      where: { id },
      data: { image: urlImagen },
    });

    return res.status(200).send({
      ok: true,
      [entityKey]: updated,
      image: urlImagen,
    });
  } catch (err) {
    await deleteFromR2(key);
    return res.status(500).send({ ok: false, err });
  }
};

let uploadFile = async (req: AuthenticatedRequest, res: Response) => {
  const id = asString(req.params.id);
  const tipo = asString(req.params.tipo);

  if (!req.files) {
    return res.status(400).send({
      ok: false,
      err: { message: 'No se ha seleccionado ningún archivo' },
    });
  }

  const archivo = req.files.archivo as UploadedFile;
  const nombreSpliteado = archivo.name.split('.');
  const extension = nombreSpliteado[nombreSpliteado.length - 1].toLowerCase();

  if (!EXTENSIONES_VALIDAS.includes(extension)) {
    return res.status(400).send({
      ok: false,
      err: {
        message: 'Las extensiones permitidas son ' + EXTENSIONES_VALIDAS.join(', '),
        ext: extension,
      },
    });
  }

  const nombreArchivo = `${id}-${Date.now()}.${extension}`;
  const key = `${tipo}/${nombreArchivo}`;
  const contentType = getContentType(extension);

  try {
    await uploadToR2(archivo.data, key, contentType);
  } catch (err) {
    return res.status(500).send({ ok: false, err });
  }

  const urlImagen = `${R2_PUBLIC_URL_PREFIX}/${key}`;

  switch (tipo) {
    case 'usuarios':
      return await updateEntityImage(prisma.user, id, key, urlImagen, 'usuario', res);
    case 'clubs':
      return await updateEntityImage(prisma.club, id, key, urlImagen, 'club', res);
    default:
      await deleteFromR2(key);
      return res.status(400).send({
        ok: false,
        err: { message: 'Tipo no válido: ' + tipo },
      });
  }
};

export { uploadFile };
