abstract class Funcionario {
        public nome: string;
        public salario: number;
        public idFuncionario: string;

        constructor(nome: string, salario: number, idFuncionario: string) {
            this.nome = nome;
            this.salario = salario;
            this.idFuncionario = idFuncionario;
        }

       public abstract calcularSalario(): number;
}

class gerente extends Funcionario {
    calcularSalario(): number {
        return this.salario * 0.2;
    }
}

class desenvolvedor extends Funcionario {
    calcularSalario(): number {
        return this.salario * 0.1;
    }
}

class estagiario extends Funcionario {
    calcularSalario(): number {
        return this.salario;
    }
}

let funcionarios: Funcionario[] = [

    new gerente("Carlos", 5000, "G001"),
    new gerente("Ana", 6000, "G002"),
    new gerente("Marcos", 5500, "G003"),
    new gerente("Beatriz", 6200, "G004"),
    new desenvolvedor("Lucas", 4000, "D001"),
    new desenvolvedor("Fernanda", 4500, "D002"),
    new desenvolvedor("Rafael", 4200, "D003"),
    new desenvolvedor("Juliana", 4800, "D004"),
    new estagiario("Pedro", 1500, "E001"),
    new estagiario("Carla", 1600, "E002"),
    new estagiario("Bruno", 1550, "E003"),
    new estagiario("Mariana", 1650, "E004"),  
];

for (let PercFunc of funcionarios) {
    console.log(`Funcionário: ${PercFunc.nome}, Cargo: ${PercFunc.constructor.name}, Salário: R$${PercFunc.salario.toFixed(2)}, Bônus: R$${PercFunc.calcularSalario().toFixed(2)}, salario total: R$${(PercFunc.salario + PercFunc.calcularSalario()).toFixed(2)}`);
}
