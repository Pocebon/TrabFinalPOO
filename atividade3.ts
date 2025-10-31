class contaBancaria {
    private titular: string;
    private saldo: number;
    private historicoTransacoes: string[];

    constructor(titular: string, saldoInicial: number) {
        this.titular = titular;
        this.saldo = saldoInicial;
        this.historicoTransacoes = [];
    }
    
}   

 interface meiodepagamento {
        pagar(valor: number): void;
    }