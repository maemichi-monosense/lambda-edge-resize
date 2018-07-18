import * as sharp from 'sharp';

type Data = Buffer | any; // 型合わせ
type Resize = (query: Query)
    => (data: Data)
    => Promise<Buffer>;

export interface Query {
    width?: number,
    height?: number,
    webp?: boolean
}

export const resize: Resize = ({width, height, webp}) => async data => {
    const image = sharp(data);
    const metadata = await image.metadata();

    // guard
    if (metadata.format !== 'jpeg') {
        throw new Error(`file format is not jpeg but: ${metadata.format}`);
    }

    image.rotate(); // before removing metadata

    // resize
    const w = Math.min(metadata.width, width);
    const h = Math.min(metadata.height, height);
    image.resize(w, h).max();

    // convert
    if (webp) {
        image.webp();
    }

    return image.toBuffer();
};
