abstract class password_generator {
    public abstract allowed_chars(): string;
    public abstract length(): number;
    public abstract add(generator: password_generator): void;
}


class basic_password_generator extends password_generator {
    private readonly _length: number;

    constructor(len: number) {
        super();
        this._length = len;
    }

    public allowed_chars(): string {
        throw new Error("Method not implemented.");
    }

    public add(generator: password_generator) {
        throw new Error("Method not implemented.");
    }
    public length(): number {
        return this._length;
    }
}


export class digit_generator extends basic_password_generator {
    constructor(length: number) {
        super(length);
    }
    allowed_chars(): string {
        return "0123456789";
    }
}


export class symbol_generator extends basic_password_generator {
    constructor(length: number) {
        super(length);
    }
    allowed_chars(): string {
        return "!@^#$%&()[]{}?";
    }
}


export class upper_letter_generator extends basic_password_generator {
    constructor(length: number) {
        super(length);
    }
    allowed_chars(): string {
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
}


export class lower_letter_generator extends basic_password_generator {
    constructor(length: number) {
        super(length);
    }
    allowed_chars(): string {
        return "abcdefghijklmnopqrstuvwxyz";
    }
}


function shuffle(str: string): string {
    let buffer = [];
    for (let i = 0; i < str.length; i++) {
        buffer.push(str[i]);
    }

    let currentIndex = str.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = buffer[currentIndex];
        buffer[currentIndex] = buffer[randomIndex];
        buffer[randomIndex] = temporaryValue;
    }

    let shuffle_string = "";
    for (let i = 0; i < buffer.length; i++) {
        shuffle_string += buffer[i];
    }
    return shuffle_string;
}


export class composite_password_generator extends password_generator {
    public allowed_chars(): string {
        throw new Error("Method not implemented.");
    }

    public length(): number {
        throw new Error("Method not implemented.");
    }

    private generator: password_generator[];

    constructor() {
        super();
        this.generator = [];
    }

    generate(): string {
        let password = "";
        this.generator.forEach(g => {
            for (let i = 0; i < g.length(); i++) {
                const randomIndex = Math.floor(Math.random() * g.allowed_chars().length);
                password += g.allowed_chars()[randomIndex];
            }
        });
        return shuffle(password);
    }

    add(generator: password_generator): void {
        this.generator.push(generator);
    }
}
