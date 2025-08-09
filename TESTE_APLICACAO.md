# 🧪 Teste da Aplicação TCC - DriveX

## 🔍 Como Testar

### 1. **Verificar se a aplicação está rodando**
- Acesse: http://localhost:5173
- Você deve ver a página com o logo da DriveX
- Deve aparecer uma mensagem: "✅ Aplicação funcionando!"

### 2. **Verificar o Console do Navegador**
1. Pressione **F12** para abrir as ferramentas do desenvolvedor
2. Vá na aba **Console**
3. Você deve ver:
   ```
   🚀 Página Home carregada
   ```

### 3. **Testar as Notificações**
- Deve aparecer um toast verde: "Página carregada com sucesso!"
- Clique no botão "Testar Conexão MongoDB"
- Deve aparecer outro toast: "Teste de conexão iniciado!"

## 🚨 Se a página estiver em branco:

### Possíveis causas:
1. **Erro de JavaScript** - Verifique o console (F12)
2. **Problema de dependências** - Execute: `npm install`
3. **Porta ocupada** - A aplicação pode estar rodando em outra porta

### Soluções:

#### **Solução 1: Reinstalar dependências**
```bash
npm install
npm run dev
```

#### **Solução 2: Limpar cache**
```bash
npm run build
npm run dev
```

#### **Solução 3: Verificar porta**
- A aplicação pode estar rodando em: http://localhost:5174 ou http://localhost:5175
- Verifique o terminal para ver em qual porta está rodando

## 📋 Checklist de Teste

- [ ] Página carrega sem erro
- [ ] Logo da DriveX aparece
- [ ] Mensagem "✅ Aplicação funcionando!" aparece
- [ ] Toast de sucesso aparece
- [ ] Botão "Testar Conexão MongoDB" funciona
- [ ] Console mostra "🚀 Página Home carregada"

## 🔧 Se ainda não funcionar:

1. **Pare a aplicação** (Ctrl+C no terminal)
2. **Execute:**
   ```bash
   npm install
   npm run dev
   ```
3. **Acesse a nova porta** mostrada no terminal

## 📞 Próximos Passos

Se a página estiver funcionando, podemos:
1. ✅ Restaurar a funcionalidade completa
2. ✅ Configurar o MongoDB Atlas
3. ✅ Testar a conexão com o banco de dados

---

**Status atual:** Teste básico da aplicação
