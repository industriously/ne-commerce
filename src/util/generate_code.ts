const ABC = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 랜덤 문자열 생성
 *
 * 대문자 알파벳과 숫자를 조합한 10자리 문자열
 */
export const generateCode = (): string => {
  const integer = (end: number) => {
    const temp = Math.floor(Math.random() * end);
    return temp === end ? temp - 1 : temp;
  };
  return new Array<number>(10)
    .fill(ABC.length)
    .map((end) => ABC[integer(end)])
    .join('');
};
