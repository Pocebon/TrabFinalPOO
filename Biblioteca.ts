class Livro {
       public  titulo: string;
        public autor: string;
        public editora: string;
        public anoPublicacao: number;
        public disponivel: boolean;   

        emprestar(): void {
            if (this.disponivel) {
                this.disponivel = false;
                console.log(`O livro "${this.titulo}" foi emprestado.`);
            } else {
                console.log(`O livro "${this.titulo}" não está disponível para empréstimo.`);
            }

        }

        devolver(): void {
            this.disponivel = true;
            console.log(`O livro "${this.titulo}" foi devolvido.`);
        }    

        constructor(titulo: string, autor: string, editora: string, anoPublicacao: number) {
            this.titulo = titulo;
            this.autor = autor;
            this.editora = editora;
            this.anoPublicacao = anoPublicacao;
            this.disponivel = true;
        }

}

class Membro {
        public nome: string
        public idMembro: string;
        public livrosEmprestados: Livro[];


        pegarEmprestado(livro: Livro): void {
            if (livro.disponivel) {
                livro.emprestar();
                this.livrosEmprestados.push(livro);
            } else {
                console.log(`O livro "${livro.titulo}" não está disponível para empréstimo.`);
            }
        }
        
        devolverLivro(livro: Livro): void {
            const index = this.livrosEmprestados.indexOf(livro);
            if (index !== -1) {
                livro.devolver();
                this.livrosEmprestados.splice(index, 1);
            } else {
                console.log(`O membro "${this.nome}" não tem o livro "${livro.titulo}" emprestado.`);
            }
        }  
         
        constructor(nome: string, idMembro: string) {
            this.nome = nome;
            this.idMembro = idMembro;
            this.livrosEmprestados = [];
        }
}

let livro1 = new Livro("1984", "George Orwell", "Companhia das Letras", 1949);
let livro2 = new Livro("O Senhor dos Anéis", "J.R.R. Tolkien", "HarperCollins", 1954);
let livro3 = new Livro("Dom Quixote", "Miguel de Cervantes", "Penguin Classics", 1605);
let livro4 = new Livro("A Revolução dos Bichos", "George Orwell", "Companhia das Letras", 1945);

let membro1 = new Membro("Bareta", "M001");
let membro2 = new Membro("Igor", "M002");
let membro3 = new Membro("Jovi", "M003");

membro1.pegarEmprestado(livro1);
membro2.pegarEmprestado(livro2);
membro1.pegarEmprestado(livro3);

membro1.devolverLivro(livro1);
membro2.devolverLivro(livro3);
membro2.devolverLivro(livro2);

membro3.pegarEmprestado(livro4);
membro1.pegarEmprestado(livro4);
membro3.devolverLivro(livro4);
membro2.pegarEmprestado(livro4);