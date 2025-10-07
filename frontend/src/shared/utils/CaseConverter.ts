/**
 * Converte um objeto de camelCase (padrão do React/JS) 
 * para snake_case (padrão do Python/Django).
 * Ex: { descricaoCurta: "Olá" } => { "descricao_curta": "Olá" }
 */
export const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      acc[newKey] = toSnakeCase(obj[key]);
      return acc;
    }, {} as {[key: string]: any});
  }
  return obj;
};

/**
 * Converte um objeto de snake_case (vindo da API Django)
 * para camelCase (usado no estado do React).
 * Ex: { "descricao_curta": "Olá" } => { descricaoCurta: "Olá" }
 */
export const fromSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => fromSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      acc[camelKey] = fromSnakeCase(obj[key]);
      return acc;
    }, {} as {[key: string]: any});
  }
  return obj;
};