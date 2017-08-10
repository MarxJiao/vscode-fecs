interface GitDiff {
    chunks: GitDiffChunk[];

    diff?: string;
}

class GitDiffChunk {

    private _chunk: string | undefined;
    private _lines: number[] | undefined;

    constructor(chunk: string, public currentPosition: { start: number, end: number }, public previousPosition: { start: number, end: number }) {
        this._chunk = chunk;
     }

    get lines(): number[] {
        if (this._lines === undefined) {
            this._lines = GitDiffParser.parseChunk(this._chunk!, this.currentPosition);
            // this._chunk = undefined;
        }
        return this._lines;
    }
}

const unifiedDiffRegex = /^@@ -([\d]+),([\d]+) [+]([\d]+),([\d]+) @@([\s\S]*?)(?=^@@)/gm;

function* skip<T>(source: Iterable<T> | IterableIterator<T>, count: number): Iterable<T> | IterableIterator<T> {
    let i = 0;
    for (const item of source) {
        if (i >= count) yield item;
        i++;
    }
}

function* stringLines(s: string): IterableIterator<string> {
    let i = 0;
    while (i < s.length) {
        let j = s.indexOf('\n', i);
        if (j === -1) {
            j = s.length;
        }

        yield s.substring(i, j);
        i = j + 1;
    }
}

export class GitDiffParser {

    static parse(data: string, debug: boolean = false): GitDiff | undefined {
        if (!data) return undefined;

        const chunks: GitDiffChunk[] = [];

        let match: RegExpExecArray | null = null;

        let chunk: string;
        let currentStart: number;
        let previousStart: number;

        do {
            match = unifiedDiffRegex.exec(`${data}\n@@`);
            if (match == null) break;

            // Stops excessive memory usage
            // https://bugs.chromium.org/p/v8/issues/detail?id=2869
            chunk = (' ' + match[5]).substr(1);
            currentStart = parseInt(match[3], 10);
            previousStart = parseInt(match[1], 10);

            chunks.push(new GitDiffChunk(chunk, { start: currentStart, end: currentStart + parseInt(match[4], 10) }, { start: previousStart, end: previousStart + parseInt(match[2], 10) }));
        } while (match != null);

        if (!chunks.length) return undefined;

        const diff = {
            diff: debug ? data : undefined,
            chunks: chunks
        } as GitDiff;
        return diff;
    }

    static parseChunk(chunk: string, position: {start: number, end: number}): number[] {
        const lines = skip(stringLines(chunk), 1);

        const start = position.start;
        const chunkLines: number[] = [];
        let offset = 0;
        for (const l of lines) {
            switch (l[0]) {
                case '+':
                    chunkLines.push(start + offset);

                    break;

                case '-':
                    offset--;
                    break;

                default:
                    break;
            }
            offset++;
        }
        return chunkLines;
    }

    static concatLine(chunks: GitDiffChunk[]|undefined): number[] {
        if (!chunks) {
            return [];
        }
        const concatChunks: number[] = [];
        for (let chunk of chunks) {
            concatChunks.push(...chunk.lines);
        }
        return concatChunks;
    }
}