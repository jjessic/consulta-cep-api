function consultaCEP(cep) {

    cep = cep.replace(/\D/g, '') //expressão regular -> regex

    if (cep != "") {

        const padraoCep = /^[0-9]{8}$/; // regex

        if (padraoCep.test(cep)) {

            document.querySelector('#bairro').setAttribute('readonly', '');
            document.querySelector('#cidade').setAttribute('readonly', '');
            document.querySelector('#uf').setAttribute('readonly', '');

            const requisicao = new Request(`https://viacep.com.br/ws/${cep}/json`, {
                "method": "GET",
                "headers": {
                    "Content-type": "application/json"
                }
            });
    
            fetch(requisicao)
            .then(resposta => resposta.json())
            .then(resposta => {

                if (!("erro" in resposta)) {

                    document.querySelector('#logradouro').value = resposta.logradouro;
                    document.querySelector('#bairro').value = resposta.bairro;
                    document.querySelector('#cidade').value = resposta.localidade;
                    document.querySelector('#uf').value = resposta.uf;

                } else {

                    limpaForm();
                    window.alert('CEP não localizado');

                    document.querySelector('#bairro').removeAttribute('readonly');
                    document.querySelector('#cidade').removeAttribute('readonly');
                    document.querySelector('#uf').removeAttribute('readonly');

                    document.querySelector('#logradouro').focus();

                }    
            });

    } else { // caso o cep esteja fora do padrão

        limpaForm();
        window.alert('O formato do CEP é inválido');

    }

} else { // caso o cep esteja vazio

    limpaForm();
    window.alert('Digite um CEP!');
}

} // fecha a função

function limpaForm() {

document.querySelectorAll('input:not(#cep)').forEach(input => {
    input.value = '';
})}

function cadastraCEP(enderecoCompleto) {
    
    fetch('http://localhost:3000/endereco', {
        "method": "POST",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(enderecoCompleto)
    }).then(resposta => {
        // if (resposta.ok) window.alert('Endereço cadastrado')
        // else window.alert('Erro: '+resposta.status)

        resposta.ok ? window.alert('Endereço cadastrado!') :
        window.alert('Erro: ' + resposta.status)
    })

}

function atualizaCEP(id, enderecoCompleto) {
    fetch(`http://localhost:3000/endereco/${id}`, {
        "method": "PUT",
        "headers": {
            "Content-type": "application/json"
        },
        "body": JSON.stringify(enderecoCompleto)
    }).then(resposta => {
        resposta.ok ? window.alert('Endereço atualizado!') :
        window.alert('Erro ' + resposta.status)
    }).catch(error => {
        window.alert('Erro na atualização ' + error.message);
    });
}

function consultaPorBairro() {
    const uf = document.querySelector('#uf').value;
    const cidade = document.querySelector('#cidade').value;
    const bairro = document.querySelector('#bairro').value;

    if (bairro.length < 3) {
        window.alert('O bairro deve conter pelo menos 3 caracteres');
        return;
    }

    if (cidade.length < 3) {
        window.alert('A cidade deve conter pelo menos 3 caracteres');
        return;
    }

    const requisicao = new Request(`https://viacep.com.br/ws/${uf}/${cidade}/${bairro}/json`, {
        "method": "GET",
        "headers": {
            "Content-type": "application/json"
        }
    });

    fetch(requisicao)
        .then(resposta => {
            if (resposta.status === 400) {
                throw new Error('Bad Request');
            }
            return resposta.json();
        })
        .then(resposta => {
            if (resposta.length > 0) {
                const resultado = resposta[0]; // Pega o primeiro resultado

                document.querySelector('#logradouro').value = resultado.logradouro;
                document.querySelector('#bairro').value = resultado.bairro;
                document.querySelector('#cidade').value = resultado.localidade;
                document.querySelector('#uf').value = resultado.uf;
            } else {
                limpaForm();
                window.alert('Endereço não localizado');
            }
        })
        .catch(error => {
            limpaForm();
            window.alert('Erro na consulta: ' + error.message);
        });
}

document.querySelector('#btnBuscarEndereco').addEventListener('click', consultaPorEndereco);
document.querySelector('#btnBuscarBairro').addEventListener('click', consultaPorBairro);