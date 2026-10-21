def adicionar_contato(contatos, nome, telefone, email, favorito=False):
    contato = {
        "nome": nome,
        "telefone": telefone,
        "email": email,
        "favorito": favorito,
    }
    contatos.append(contato)
    print(f"\nContato '{nome}' adicionado com sucesso!")


def ver_contatos(contatos):
    print("\nLista de contatos:")
    if not contatos:
        print("Nenhum contato cadastrado.")
        return

    for indice, contato in enumerate(contatos, start=1):
        favorito = "★" if contato["favorito"] else " "
        print(
            f"{indice}. [{favorito}] {contato['nome']} | "
            f"Tel: {contato['telefone']} | Email: {contato['email']}"
        )


def obter_indice(contatos, indice_usuario):
    try:
        indice = int(indice_usuario) - 1
    except ValueError:
        print("\nÍndice inválido. Digite um número.")
        return None

    if 0 <= indice < len(contatos):
        return indice

    print("\nÍndice inválido.")
    return None


def editar_contato(contatos, indice_usuario):
    indice = obter_indice(contatos, indice_usuario)
    if indice is None:
        return

    contato = contatos[indice]
    print("Deixe em branco para manter o valor atual.")

    novo_nome = input(f"Nome ({contato['nome']}): ").strip()
    novo_telefone = input(f"Telefone ({contato['telefone']}): ").strip()
    novo_email = input(f"Email ({contato['email']}): ").strip()

    contato["nome"] = novo_nome or contato["nome"]
    contato["telefone"] = novo_telefone or contato["telefone"]
    contato["email"] = novo_email or contato["email"]

    print(f"\nContato {indice + 1} atualizado com sucesso!")


def alternar_favorito(contatos, indice_usuario):
    indice = obter_indice(contatos, indice_usuario)
    if indice is None:
        return

    contato = contatos[indice]
    contato["favorito"] = not contato["favorito"]
    status = "marcado como favorito" if contato["favorito"] else "desmarcado como favorito"
    print(f"\nContato '{contato['nome']}' {status}.")


def ver_favoritos(contatos):
    print("\nLista de contatos favoritos:")
    favoritos = [
        (indice, contato)
        for indice, contato in enumerate(contatos, start=1)
        if contato["favorito"]
    ]

    if not favoritos:
        print("Nenhum contato favorito.")
        return

    for indice, contato in favoritos:
        print(
            f"{indice}. {contato['nome']} | "
            f"Tel: {contato['telefone']} | Email: {contato['email']}"
        )


def apagar_contato(contatos, indice_usuario):
    indice = obter_indice(contatos, indice_usuario)
    if indice is None:
        return

    contato = contatos.pop(indice)
    print(f"\nContato '{contato['nome']}' apagado com sucesso!")


def ler_obrigatorio(mensagem):
    while True:
        valor = input(mensagem).strip()
        if valor:
            return valor
        print("Este campo é obrigatório.")


def main():
    contatos = []

    while True:
        print("\n===== Menu da Agenda =====")
        print("1. Adicionar contato")
        print("2. Ver contatos")
        print("3. Editar contato")
        print("4. Marcar/desmarcar contato como favorito")
        print("5. Ver contatos favoritos")
        print("6. Apagar contato")
        print("7. Sair")

        escolha = input("Digite a sua escolha: ").strip()

        if escolha == "1":
            nome = ler_obrigatorio("Nome: ")
            telefone = ler_obrigatorio("Telefone: ")
            email = ler_obrigatorio("Email: ")
            favorito = input("Favorito? (s/n): ").strip().lower() == "s"
            adicionar_contato(contatos, nome, telefone, email, favorito)

        elif escolha == "2":
            ver_contatos(contatos)

        elif escolha == "3":
            ver_contatos(contatos)
            if contatos:
                editar_contato(contatos, input("Número do contato a editar: "))

        elif escolha == "4":
            ver_contatos(contatos)
            if contatos:
                alternar_favorito(contatos, input("Número do contato: "))

        elif escolha == "5":
            ver_favoritos(contatos)

        elif escolha == "6":
            ver_contatos(contatos)
            if contatos:
                apagar_contato(contatos, input("Número do contato a apagar: "))

        elif escolha == "7":
            print("\nAgenda encerrada. Até logo!")
            break

        else:
            print("\nOpção inválida. Tente novamente.")


if __name__ == "__main__":
    main()
