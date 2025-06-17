/** Função utilitária para obter o nome do arquivo da página onde o script é executado */
function getPageName() {
    const path = window.location.pathname;
    const pagina = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return pagina.replace('.html', '');
}

/** Função utilitária para carregar e injetar fragmento html em seletor específico
 * url - caminho do arquivo html a ser carregado
 * selector - seletor do elemento onde o html será injetado */
function injectHTML(url, selector) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`Erro ao carregar ${url}: ${response.status}`);
      return response.text();
    })
    .then(html => {
      const target = document.querySelector(selector);
      if (target) target.innerHTML = html;
      else console.warn(`Elemento "${selector}" não encontrado.`);
    })
    .catch(err => console.error('Erro ao carregar o HTML:', err));
}

/** Função utilitária. Recebe o link do arquivo .css e o carrega no head*/
function addStyle(href) {
  document.head.appendChild(Object.assign(document.createElement('link'), {
    rel: 'stylesheet', href
  }));
}

/** Carrega os eslitos de forma dinâmica na página atual */
function loadStyles(){
    // adiciona o CSS global
    addStyle('/pages/global.css');
    addStyle('/pages/global_tablet.css');
    addStyle('/pages/global_phone.css');
    // adiciona o favicon
    document.head.appendChild(Object.assign(document.createElement('link'), {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: '/assets/images/logo-cegesp-original.png'
    }));
 
    /** Faz o carregamento seletivo dos estilos, de acordo com a página */
    const pageName = getPageName(); // obtêm o nome do arquivo da página atual
    if(pageName == 'index'){ // adiciona estilos da página index
        addStyle('/pages/index.css');
        addStyle('/pages/index_tablet.css');
        addStyle('/pages/index_phone.css');
    }else if(pageName == 'noticia_modelo'){
        addStyle('/pages/noticias/single/noticia_modelo.css');
        addStyle('/pages/noticias/single/noticia_modelo_tablet.css');
        addStyle('/pages/noticias/single/noticia_modelo_phone.css');
    }else{
        addStyle(`/pages/${pageName}/${pageName}.css`);
        addStyle(`/pages/${pageName}/${pageName}_tablet.css`);
        addStyle(`/pages/${pageName}/${pageName}_phone.css`);
    }
      
}

/** Carrega dinamicamente o conteúdo e os estilos do header */
function loadHeader(){
    injectHTML('/templates/header/header.html', '#header');
    addStyle('/templates/header/header.css');
    addStyle('/templates/header/header_tablet.css');
    addStyle('/templates/header/header_phone.css');
}

/** Carrega dinamicamente o conteúdo e os estilos do footer */
function loadFooter(){
    injectHTML('/templates/footer/footer.html', '#footer');
    addStyle('/templates/footer/footer.css');
    addStyle('/templates/footer/footer_tablet.css');
    addStyle('/templates/footer/footer_phone.css');
}

loadStyles(); // carrega os estilos da página
loadHeader(); // carrega o header e seus estilos
loadFooter(); // carrega o footer e seus estilos
document.documentElement.style.display = ''; // exibe o conteúdo da página após o carregamento
	