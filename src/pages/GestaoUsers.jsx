import React, { useEffect, useState } from 'react';
import './GestaoUsers.css';
import Main from '../components/template/Main'; // importa seu layout com header

const GestaoUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    senha: '',
    cargo: 'admin',
  });

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:3010/users');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const iniciarEdicao = (user) => {
    setEditando(user.id || user._id);
    setForm({ name: user.name, email: user.email, senha: '', cargo: user.cargo });
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3010/users/${editando}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert('Usuário atualizado!');
        setEditando(null);
        setForm({ name: '', email: '', senha: '', cargo: 'admin' });
        fetchUsuarios();
      } else {
        alert('Erro ao atualizar');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const excluirUsuario = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir?')) return;
    try {
      const res = await fetch(`http://localhost:3010/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        alert('Usuário excluído!');
        fetchUsuarios();
      } else {
        alert('Erro ao excluir');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cadastrarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3010/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Usuário cadastrado!');
        setForm({ name: '', email: '', senha: '', cargo: 'admin' });
        fetchUsuarios();
      } else {
        alert(`Erro: ${data.msg}`);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar usuário');
    }
  };

  return (
    <Main
      icon="users" // ícone da Font Awesome que representa usuários
      title="Gestão de Usuários"
      subtitle="Gerencie permissões, cargos e acessos do sistema"
    >
    
      <div className="gestao-container">
        {/* conteúdo original */}
        <form onSubmit={editando ? salvarEdicao : cadastrarUsuario} className="form-cadastro">
          <h3>{editando ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h3>
          <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input
            name="senha"
            type="password"
            placeholder={editando ? 'Nova Senha' : 'Senha'}
            value={form.senha}
            onChange={handleChange}
            required={!editando}
          />
          <select name="cargo" value={form.cargo} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="tecnico">Técnico</option>
            <option value="supervisor">Supervisor</option>
            <option value="engenheiro">Engenheiro</option>
            <option value="planejador">Planejador de manutenção</option>
          </select>
          <button type="submit">{editando ? 'Salvar' : 'Cadastrar'}</button>
          {editando && <button type="button" onClick={() => setEditando(null)}>Cancelar</button>}
        </form>

        <div className="tabela-wrapper">
          <table className="tabela-usuarios">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id || u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.cargo}</td>
                  <td>
                    <button onClick={() => iniciarEdicao(u)}>✏️</button>
                    <button onClick={() => excluirUsuario(u.id || u._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Main>
  );
};

export default GestaoUsers;
