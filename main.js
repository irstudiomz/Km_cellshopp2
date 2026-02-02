<script>
    lucide.createIcons();

    let cart = [];
    let products = JSON.parse(localStorage.getItem('goddid_products')) || [
        { id: 1, name: 'iPhone 15 Pro', price: '85.900 MT', cat: 'iPhones', img: '', stock: true }
    ];
    let settings = JSON.parse(localStorage.getItem('goddid_settings')) || { title: 'Liquid Glass', slogan: 'iOS 26 Architecture', logo: 'Goddid Soluções', logoImg: '' };
    let history = JSON.parse(localStorage.getItem('goddid_history')) || [];

    let currentProductImg = "";
    let currentLogoImg = settings.logoImg;

    // --- FUNÇÕES DE INTERFACE ---
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const icon = document.getElementById('theme-icon');
        icon.setAttribute('data-lucide', document.body.classList.contains('dark-mode') ? 'sun' : 'moon');
        lucide.createIcons();
        localStorage.setItem('goddid_theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    function openSheet(id) { 
        document.getElementById('body').classList.add('blurred'); 
        document.getElementById(id).classList.add('active'); 
    }

    function closeSheets() { 
        document.getElementById('body').classList.remove('blurred'); 
        document.querySelectorAll('.sheet').forEach(s => s.classList.remove('active')); 
    }

    // --- LÓGICA DO CARRINHO E PEDIDO ---
    function addToCart(id) {
        const prod = products.find(p => p.id == id);
        cart.push(prod);
        updateCartUI();
    }

    function updateCartUI() {
        const container = document.getElementById('cart-items-container');
        const badge = document.getElementById('cart-badge');
        badge.innerText = cart.length;
        
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item-row">
                <span>${item.name}</span>
                <span style="font-weight:700;">${item.price}</span>
                <i data-lucide="trash-2" size="16" onclick="removeFromCart(${index})" style="color:#ff4444; cursor:pointer;"></i>
            </div>
        `).join('');
        
        document.getElementById('cart-total').innerText = `Subtotal: ${cart.length} item(s)`;
        lucide.createIcons();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function confirmOrder() {
        const name = document.getElementById('cust-name').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const addr = document.getElementById('cust-address').value.trim();
        const notes = document.getElementById('cust-notes').value.trim();

        if(!name || !phone || !addr) {
            alert("Por favor, preencha o Nome, Telefone e Endereço.");
            return;
        }

        // 1. Salvar no Histórico com TODAS as informações
        const orderData = { 
            id: Date.now(), 
            date: new Date().toLocaleString('pt-PT'), 
            customer: name, 
            phone: phone,
            address: addr,
            notes: notes || "Nenhuma nota",
            items: [...cart] 
        };
        
        history.push(orderData);
        localStorage.setItem('goddid_history', JSON.stringify(history));

        // 2. Preparar mensagem para WhatsApp
        let itensTexto = cart.map(i => `- ${i.name} (${i.price})`).join('%0A');
        const msg = `🚀 *NOVO PEDIDO - GODDID*%0A%0A*PRODUTOS:*%0A${itensTexto}%0A%0A*DADOS DE ENTREGA:*%0A👤 *Nome:* ${name}%0A📞 *Telefone:* ${phone}%0A📍 *Endereço:* ${addr}%0A📝 *Notas:* ${notes || 'Nenhuma'}`;
        
        // 3. Redirecionamento Direto (Funciona melhor em Mobile)
        window.location.href = `https://wa.me/258845478417?text=${msg}`;
        
        // 4. Resetar Carrinho
        cart = [];
        updateCartUI();
        closeSheets();
    }

    // --- PAINEL ADMINISTRATIVO ---
    function renderHistory() {
        const container = document.getElementById('admin-history-list');
        if(!history.length) {
            container.innerHTML = '<p style="text-align:center; opacity:0.5;">Nenhum pedido ainda.</p>';
            return;
        }

        container.innerHTML = history.slice().reverse().map(h => `
            <div class="order-row" style="flex-direction:column; align-items:flex-start; gap:8px; padding:15px;">
                <div style="display:flex; justify-content:space-between; width:100%; border-bottom:1px solid var(--border); padding-bottom:5px;">
                    <span style="font-size:0.7rem; opacity:0.6;">#${h.id} - ${h.date}</span>
                    <span style="font-weight:800; color:var(--orange);">${h.phone}</span>
                </div>
                <div style="font-size:0.9rem;">
                    <strong>Cliente:</strong> ${h.customer}<br>
                    <strong>Endereço:</strong> ${h.address}<br>
                    <strong>Obs:</strong> ${h.notes}
                </div>
                <div style="background:rgba(0,0,0,0.05); width:100%; padding:8px; border-radius:10px; font-size:0.8rem;">
                    <strong>Itens:</strong><br>
                    ${h.items.map(i => `• ${i.name}`).join('<br>')}
                </div>
            </div>
        `).join('');
    }

    // (As outras funções de renderização de produtos e categorias permanecem iguais ao seu código original)
    // ... logic for addProduct, deleteProduct, renderMarketplace, etc ...

    window.onload = () => {
        renderMarketplace();
        // Carregar configurações iniciais
        if(localStorage.getItem('goddid_theme') === 'dark') toggleTheme();
    };
</script>
