import { promisify } from 'util';
import { default as GatsbyParser } from 'gatsby/dist/query/file-parser';
import fs from 'fs';
import path from 'path';

export const collectGQLFragments = async dirname => {
    const parser = new GatsbyParser();
    const files = await promisify(fs.readdir)(dirname);
    const result = await parser.parseFiles(
        files.map(file => path.join(dirname, file))
    );
    return result
        .filter(item => item.doc && item.doc.kind === "Document")
        .map(doc => doc.text)
        .join("\n");
};
