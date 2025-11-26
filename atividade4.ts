
class Livro {
  public disponiveis: number;

  constructor(
    public id: number,
    public titulo: string,
    public autor: string,
    public ano: number,
    public quantidade: number,
    public categoria: string,
    public preco: number
  ) {
    this.disponiveis = quantidade;
  }

  public estaDisponivel(): boolean {
    return this.disponiveis > 0;
  }

  public retirar(): void {
    if (!this.estaDisponivel()) throw new Error("Livro indisponível");
    this.disponiveis--;
  }

  public devolver(): void {
    if (this.disponiveis < this.quantidade) {
      this.disponiveis++;
    }
  }
}

class Usuario {
  public ativo: boolean = true;
  public multas: number = 0;

  constructor(
    public id: number,
    public nome: string,
    public cpf: string,
    public tipo: "estudante" | "professor" | "comum",
    public telefone: string
  ) {}

  public podeEmprestar(): boolean {
    return this.ativo && this.multas === 0;
  }

  public adicionarMulta(valor: number) {
    this.multas += valor;
  }
}

class Emprestimo {
  public devolvido: boolean = false;
  public dataDevolucaoReal?: Date;
  public multa: number = 0;

  constructor(
    public id: number,
    public usuario: Usuario,
    public livro: Livro,
    public dataEmprestimo: Date,
    public dataDevolucao: Date,
    public diasPermitidos: number,
    public taxaMultaDiaria: number,
    public tipo: string
  ) {}
}

class Reserva {
  constructor(
    public id: number,
    public usuario: Usuario,
    public livro: Livro,
    public ativo: boolean = true
  ) {}
}

class ValidacaoService {
  validarUsuario(usuario: Usuario | undefined) {
    if (!usuario) throw new Error("Usuário não encontrado");
    if (!usuario.ativo) throw new Error("Usuário inativo");
    if (!usuario.podeEmprestar()) throw new Error(`Usuário possui multas`);
  }

  validarLivro(livro: Livro | undefined) {
    if (!livro) throw new Error("Livro não encontrado");
    if (!livro.estaDisponivel()) throw new Error("Livro indisponível");
  }
}

class RegrasEmprestimoService {
  calcular(usuario: Usuario, tipo: string) {
    let diasPermitidos = 0;
    let taxaMultaDiaria = 0;

    const regras = {
      estudante: { normal: 14, renovacao: 7, multa: 0.5 },
      professor: { normal: 30, renovacao: 15, multa: 0.3 },
      comum: { normal: 7, renovacao: 3, multa: 1 },
    };

    if (tipo === "normal" || tipo === "renovacao") {
      diasPermitidos = regras[usuario.tipo][tipo];
      taxaMultaDiaria = regras[usuario.tipo].multa;
    } else if (tipo === "expresso") {
      diasPermitidos = 1;
      taxaMultaDiaria = 5;
    } else {
      throw new Error("Tipo inválido");
    }

    return { diasPermitidos, taxaMultaDiaria };
  }
}

class NotificacaoService {
  enviarEmprestimo(usuario: Usuario, livro: Livro, dev: Date) {
    console.log(`Email enviado para ${usuario.nome}: Empréstimo confirmado.`);
    console.log(`SMS: Devolver '${livro.titulo}' até ${dev.toLocaleDateString()}`);
  }

  enviarMulta(usuario: Usuario, multa: number) {
    console.log(`Email: Multa de R$${multa.toFixed(2)} aplicada ao usuário ${usuario.nome}`);
  }
}

class ComprovanteService {
  imprimirEmprestimo(e: Emprestimo) {
    console.log(`
╔════════════════════════════════╗
║    COMPROVANTE DE EMPRÉSTIMO   ║
╠════════════════════════════════╣
Usuário: ${e.usuario.nome}
Livro: ${e.livro.titulo}
Data Empréstimo: ${e.dataEmprestimo.toLocaleDateString()}
Devolver até: ${e.dataDevolucao.toLocaleDateString()}
Tipo: ${e.tipo}
╚════════════════════════════════╝
`);
  }

  imprimirDevolucao(e: Emprestimo) {
    console.log(`
╔════════════════════════════════╗
║    COMPROVANTE DE DEVOLUÇÃO    ║
╠════════════════════════════════╣
Usuário: ${e.usuario.nome}
Livro: ${e.livro.titulo}
Data Devolução: ${e.dataDevolucaoReal?.toLocaleDateString()}
Multa: R$${e.multa.toFixed(2)}
╚════════════════════════════════╝
`);
  }
}


class BibliotecaManager {
  public livros: any[] = [];
  public usuarios: any[] = [];
  public emprestimos: Emprestimo[] = [];
  public reservas: Reserva[] = [];

  private validacao = new ValidacaoService();
  private regras = new RegrasEmprestimoService();
  private notificacao = new NotificacaoService();
  private comprovante = new ComprovanteService();

  constructor() {
    this.carregarDadosIniciais();
  }

  private carregarDadosIniciais() {
    this.livros = [
      new Livro(1, "Clean Code", "Robert Martin", 2008, 3, "tecnologia", 89.9),
      new Livro(2, "1984", "George Orwell", 1949, 2, "ficcao", 45),
      new Livro(3, "Sapiens", "Yuval Harari", 2011, 4, "historia", 65.5),
      new Livro(4, "O Hobbit", "Tolkien", 1937, 2, "fantasia", 55),
    ];

    this.usuarios = [
      new Usuario(1, "Ana Silva", "12345678901", "estudante", "48999999999"),
      new Usuario(2, "Carlos Santos", "98765432100", "professor", "48988888888"),
      new Usuario(3, "Beatriz Costa", "11122233344", "comum", "48977777777"),
    ];
  }

  realizarEmprestimo(usuarioId: number, livroId: number, dias: number, tipo: string) {
    try {
      const usuario = this.usuarios.find((u) => u.id === usuarioId);
      const livro = this.livros.find((l) => l.id === livroId);

      this.validacao.validarUsuario(usuario);
      this.validacao.validarLivro(livro);

      const { diasPermitidos, taxaMultaDiaria } = this.regras.calcular(usuario, tipo);

      if (dias > diasPermitidos) {
        throw new Error(`Período excede o permitido: ${diasPermitidos} dias`);
      }

      livro.retirar();

      const id = this.emprestimos.length + 1;
      const dataEmp = new Date();
      const dataDev = new Date();
      dataDev.setDate(dataDev.getDate() + dias);

      const e = new Emprestimo(id, usuario, livro, dataEmp, dataDev, diasPermitidos, taxaMultaDiaria, tipo);
      this.emprestimos.push(e);

      this.notificacao.enviarEmprestimo(usuario, livro, dataDev);
      this.comprovante.imprimirEmprestimo(e);
    } catch (e: any) {
      console.log("ERRO:", e.message);
    }
  }

  realizarDevolucao(emprestimoId: number) {
    try {
      const e = this.emprestimos.find((x) => x.id === emprestimoId);
      if (!e) throw new Error("Empréstimo não encontrado");
      if (e.devolvido) throw new Error("Este livro já foi devolvido");

      const hoje = new Date();
      const atraso = Math.max(0, Math.floor((hoje.getTime() - e.dataDevolucao.getTime()) / 86400000));
      e.multa = atraso * e.taxaMultaDiaria;

      if (e.multa > 0) {
        e.usuario.adicionarMulta(e.multa);
        this.notificacao.enviarMulta(e.usuario, e.multa);
      }

      e.devolvido = true;
      e.dataDevolucaoReal = hoje;
      e.livro.devolver();

      this.comprovante.imprimirDevolucao(e);
    } catch (e: any) {
      console.log("ERRO:", e.message);
    }
  }

  buscarLivros(termo: string) {
    const encontrados = this.livros.filter(
      (l: Livro) =>
        l.titulo.toLowerCase().includes(termo.toLowerCase()) ||
        l.autor.toLowerCase().includes(termo.toLowerCase())
    );

    if (encontrados.length === 0) {
      console.log("Nenhum livro encontrado");
      return;
    }

    encontrados.forEach((l: Livro) => {
      console.log(`\n📚 ${l.titulo}`);
      console.log(`Autor: ${l.autor}`);
      console.log(`Disponíveis: ${l.disponiveis}/${l.quantidade}`);
    });
  }

  adicionarLivro(t: string, a: string, ano: number, q: number, c: string, p: number) {
    const id = this.livros.length + 1;
    this.livros.push(new Livro(id, t, a, ano, q, c, p));
    console.log("Livro adicionado:", t);
  }

  cadastrarUsuario(nome: string, cpf: string, tipo: any, telefone: string) {
    const id = this.usuarios.length + 1;
    this.usuarios.push(new Usuario(id, nome, cpf, tipo, telefone));
    console.log("Usuário cadastrado:", nome);
  }

  gerarRelatorioCompleto() {
    console.log("\n======= RELATÓRIO COMPLETO =======");

    console.log("\n-- LIVROS --");
    this.livros.forEach((l: Livro) =>
      console.log(`${l.titulo} - Disp: ${l.disponiveis}/${l.quantidade}`)
    );

    console.log("\n-- USUÁRIOS --");
    this.usuarios.forEach((u: Usuario) =>
      console.log(`${u.nome} - Multas: R$${u.multas}`)
    );

    console.log("\n-- EMPRÉSTIMOS ATIVOS --");
    this.emprestimos
      .filter((e) => !e.devolvido)
      .forEach((e) => console.log(`${e.livro.titulo} → ${e.usuario.nome}`));
  }
}

console.log("╔═══════════════════════════════════════════╗");
console.log("║   SISTEMA DE GERENCIAMENTO DE BIBLIOTECA  ║");
console.log("╚═══════════════════════════════════════════╝");

const biblioteca = new BibliotecaManager();

console.log("\n--- TESTE 1: Empréstimo Normal ---");
biblioteca.realizarEmprestimo(1, 1, 10, "normal");

console.log("\n--- TESTE 2: Empréstimo para Professor ---");
biblioteca.realizarEmprestimo(2, 2, 20, "normal");

console.log("\n--- TESTE 3: Tentativa de empréstimo com multa pendente ---");
biblioteca.realizarEmprestimo(2, 3, 5, "normal");

console.log("\n--- TESTE 4: Buscar livros ---");
biblioteca.buscarLivros("code");

console.log("\n--- TESTE 5: Devolução ---");
biblioteca.realizarDevolucao(1);

console.log("\n--- TESTE 6: Adicionar novos livro ---");
biblioteca.livros.push({ id: 5, titulo: "Design Patterns", autor: "Gang of Four", ano: 1994, quantidade: 2, disponiveis: 2, categoria: "tecnologia", preco: 120.00 });
biblioteca.adicionarLivro("Design Patterns", "Gang of Four", 1994, 2, "tecnologia", 120.00);

console.log("\n--- TESTE 7: Cadastrar novo usuário ---");
biblioteca.usuarios.push({ id: 4, nome: "Diego Souza", cpf: "55566677788", tipo: "estudante", ativo: true, multas: 0, telefone: "48966666666" });
biblioteca.cadastrarUsuario("Diego Souza", "55566677788", "estudante", "48966666666");

biblioteca.gerarRelatorioCompleto();