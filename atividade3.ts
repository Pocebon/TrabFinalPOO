
class ContaBancaria {
  private titular: string;
  private saldo: number;
  private historicoTransacoes: string[];

  constructor(titular: string, saldoInicial: number) {
    this.titular = titular;
    this.saldo = saldoInicial;
    this.historicoTransacoes = [];
  }
  public getTitular(): string {
    return this.titular;
  }

  public getSaldo(): string {
    return 'R$ ' + this.saldo.toFixed(2);
  }

  public debitar(valor: number): boolean {
    if (valor <= 0) {
      console.log("Valor não válido");
      return false;
    }

    if (this.saldo >= valor) {
      this.saldo -= valor;
      this.historicoTransacoes.push(`Pagamento de R$ ${valor.toFixed(2)} realizado.`);
      return true;
    } else {
      console.log("Saldo insuficiente");
      return false;
    }
  }

  public depositar(valor: number): void {
    if (valor > 0) {
      this.saldo += valor;
      this.historicoTransacoes.push(`Depósito de R$ ${valor.toFixed(2)} recebido.`);
    }
  }

  public exibirHistorico(): void {
    console.log(`Histórico da conta de ${this.titular}:`);
    this.historicoTransacoes.forEach((t) => console.log(t));
  }
}

interface MeioPagamento {
  processarPagamento(valor: number, conta: ContaBancaria): void;
}

class CartaoCredito implements MeioPagamento {
  private limite: number;

  constructor(limite: number) {
    this.limite = limite;
  }

  processarPagamento(valor: number, conta: ContaBancaria): void {
    if (valor <= this.limite) {
      console.log(`Pagamento de R$ ${valor.toFixed(2)} com Cartão de Crédito aprovado.`);
      this.limite -= valor;
    } else {
      console.log(`Cartão de Crédito sem limite suficiente`);
    }
  }
}

class CartaoDebito implements MeioPagamento {
  processarPagamento(valor: number, conta: ContaBancaria): void {
    console.log(`Tentando pagamento de R$ ${valor.toFixed(2)} com Cartão de Débito...`);
    const sucesso = conta.debitar(valor);
    if (sucesso) console.log("Pagamento aprovado com débito.");
  }
}

class BoletoBancario implements MeioPagamento {
  processarPagamento(valor: number, conta: ContaBancaria): void {
    console.log(`Gerando boleto no valor de R$ ${valor.toFixed(2)} para ${conta.getTitular()}...`);
    conta.debitar(valor);
    console.log("Boleto emitido e pago com sucesso!");
  }
}

class Pix implements MeioPagamento {
  private chavePix: string;

  constructor(chavePix: string) {
    this.chavePix = chavePix;
  }

  processarPagamento(valor: number, conta: ContaBancaria): void {
    console.log(`Enviando Pix de R$ ${valor.toFixed(2)} `);
    const sucesso = conta.debitar(valor);
    if (sucesso) console.log("Pix enviado com sucesso!");
  }
}

const conta1 = new ContaBancaria("Bruno", 1000);
const conta2 = new ContaBancaria("Ana", 500);
const conta3 = new ContaBancaria("Carlos", 2000);
const conta4 = new ContaBancaria("Marina", 1500);

const credito = new CartaoCredito(800);
const debito = new CartaoDebito();
const boleto = new BoletoBancario();
const pix = new Pix("chavepix@exemplo.com");

debito.processarPagamento(200, conta1);
credito.processarPagamento(600, conta2);
pix.processarPagamento(100, conta3);
boleto.processarPagamento(400, conta4);

conta1.exibirHistorico();
conta2.exibirHistorico();
conta3.exibirHistorico();
conta4.exibirHistorico();