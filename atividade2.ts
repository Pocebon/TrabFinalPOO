abstract class Funcionario {
    public nome: string;
    protected salario: number;
    private idFuncionario: string;

    constructor(nome: string, salario: number, idFuncionario: string) {
        this.nome = nome;
        this.salario = salario;
        this.idFuncionario = idFuncionario;
    }

    public getSalario(): string {
        return 'R$ '+this.salario.toFixed(2);
    }

    public abstract calcularSalario():number ;
}

class Gerente extends Funcionario {
    calcularSalario(): number {
        return this.salario * 0.2;
    }
}

class Desenvolvedor extends Funcionario {
    calcularSalario(): number {
        return this.salario * 0.1;
    }
}

class Estagiario extends Funcionario {
    calcularSalario(): number {
        return this.salario;
    }
}

let funcionarios: Funcionario[] = [

    new Gerente("Carlos", 5000, "G001"),
    new Gerente("Ana", 6000, "G002"),
    new Gerente("Marcos", 5500, "G003"),
    new Gerente("Beatriz", 6200, "G004"),
    new Desenvolvedor("Lucas", 4000, "D001"),
    new Desenvolvedor("Fernanda", 4500, "D002"),
    new Desenvolvedor("Rafael", 4200, "D003"),
    new Desenvolvedor("Juliana", 4800, "D004"),
    new Estagiario("Pedro", 1500, "E001"),
    new Estagiario("Carla", 1600, "E002"),
    new Estagiario("Bruno", 1550, "E003"),
    new Estagiario("Mariana", 1650, "E004"),
];

for (let PercFunc of funcionarios) {
    console.log(PercFunc['idFuncionario']);
    console.log(`
Funcionário: ${PercFunc.nome},
Cargo: ${PercFunc.constructor.name}, 
Salário: ${PercFunc.getSalario()}, 
Bônus:${PercFunc.calcularSalario().toFixed(2)}, 
Salario total: R$ ${(PercFunc['salario'] + PercFunc.calcularSalario()).toFixed(2)}`);
}