// Este arquivo aplica correções globais para que JSON.stringify()
// consiga serializar os tipos BigInt e Decimal (usados pelo Prisma).

// 1. Correção para BigInt (essencial para o campo 'populacao')
(BigInt.prototype as any).toJSON = function () {
    // Converte BigInt para string.
    // Isso impede que o Express falhe ao tentar serializar o objeto.
    return this.toString();
};

// 2. Correção para Decimal (segurança para o campo 'pib')
try {
    // Tenta carregar o tipo Decimal da dependência 'decimal.js'
    // que o Prisma usa internamente.
    const { Decimal } = require('decimal.js');

    if (Decimal && Decimal.prototype) {
        (Decimal.prototype as any).toJSON = function () {
            // Converte Decimal para string.
            return this.toString();
        };
    }
} catch (error) {
    // Ignora o erro se o Decimal não for encontrado.
}

console.log("✅ JSON Serializer configurado para BigInt e Decimal.");

export { };