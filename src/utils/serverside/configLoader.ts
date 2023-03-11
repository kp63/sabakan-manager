const configLoader = {
  boolean: (payload: unknown): boolean => {
    if (typeof payload === "undefined") {
      return false;
    }

    if (payload === true) {
      return true;
    }

    if (typeof payload === "string") {
      const boolean = payload.toLowerCase().trim();
      if (["true", "on", "yes"].includes(boolean)) {
        return true;
      }
    }

    return false;
  },

  string: (payload: unknown): string | null => {
    if (typeof payload === "undefined") {
      return null;
    }

    if (typeof payload === "string" || typeof payload === "number") {
      return String(payload).trim();
    }

    return null;
  },

  enum: <R = any, T extends string[] = any>(payload: unknown, rules: T, strict?: boolean): R | null => {
    const _string = configLoader.string(payload);
    if (!_string) return null;
    const string = strict ? _string : _string.trim().toLowerCase();

    const i = rules.findIndex((value) => value === string);
    if (i !== -1) {
      return rules[i] as R;
    }

    return null;
  },

  number: (payload: unknown): number | null => {
    if (typeof payload === "undefined") {
      return null;
    }

    if (typeof payload === "number") {
      return Number(payload);
    }

    if (typeof payload === "string") {
      const number = payload.trim();
      if  (number.match(/^[0-9]+$/))  {
        return Number(payload);
      }
    }

    return null;
  },

  port: (payload: unknown): number | null => {
    const number = configLoader.number(payload);
    if (!number) return null;

    if (number > 0 && number < 65536) {
      return number;
    }

    return null;
  }

  // path: (payload: unknown, fallbackPath?: string): string | null => {
  //   const string = configLoader.string(payload);
  //   if (!string) return null;
  //   const path = string.trim().toLowerCase();
  //
  //   try {
  //     return fs.realpathSync(path);
  //   } catch (e) {}
  //
  //   if (fallbackPath) {
  //     try {
  //       const realPath = fs.realpathSync(fallbackPath);
  //       console.warn(`A some config property is replaced to default directory, because directory "${path}" hasn't exist.`);
  //       return realPath;
  //     } catch (e) {}
  //   }
  //
  //   return null;
  // },

}

export default configLoader;
