import React from 'react';
import { api } from '../services/api';
import { Apartment, User, ContactMessage } from '../types';

type Tab = 'pending' | 'messages' | 'users' | 'stats';

export const Admin: React.FC = () => {
  const [tab, setTab] = React.useState<Tab>('pending');
  const [error, setError] = React.useState<string>('');

  const [pending, setPending] = React.useState<Apartment[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [messages, setMessages] = React.useState<ContactMessage[]>([]);
  const [stats, setStats] = React.useState<any>(null);

  const load = async () => {
    setError('');
    try {
      const [pendingRes, usersRes, msgRes, statsRes] = await Promise.all([
        api.admin.listApartments({ status: 'pending' }),
        api.admin.listUsers(),
        api.admin.listMessages(),
        api.admin.stats()
      ]);

      setPending(pendingRes.items || []);
      setUsers(usersRes.items || []);
      setMessages(msgRes.items || []);
      setStats(statsRes);
    } catch (e: any) {
      setError(e?.message || 'Failed to load admin data');
    }
  };

  React.useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.admin.approveApartment(id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Approve failed');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.admin.rejectApartment(id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Reject failed');
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await api.admin.deleteMessage(id);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Delete failed');
    }
  };

  const handleToggleBan = async (id: string, isBanned: boolean) => {
    try {
      await api.admin.banUser(id, !isBanned);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Ban failed');
    }
  };

  const handleToggleRole = async (id: string, role: User['role']) => {
    try {
      const next = role === 'admin' ? 'user' : 'admin';
      await api.admin.setUserRole(id, next);
      await load();
    } catch (e: any) {
      setError(e?.message || 'Role change failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <button onClick={load} className="px-4 py-2 rounded-lg bg-gray-900 text-white">
          Refresh
        </button>
      </div>

      {error ? <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">{error}</div> : null}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-2 rounded-lg border ${tab === 'pending' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
        >
          Pending ({pending.length})
        </button>
        <button
          onClick={() => setTab('messages')}
          className={`px-4 py-2 rounded-lg border ${tab === 'messages' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
        >
          Messages ({messages.length})
        </button>
        <button
          onClick={() => setTab('users')}
          className={`px-4 py-2 rounded-lg border ${tab === 'users' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setTab('stats')}
          className={`px-4 py-2 rounded-lg border ${tab === 'stats' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white'}`}
        >
          Stats
        </button>
      </div>

      {tab === 'pending' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {pending.length === 0 ? (
              <div className="p-6 text-gray-600">No pending apartments.</div>
            ) : (
              pending.map((a) => (
                <div key={a.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{a.title}</div>
                    <div className="text-sm text-gray-600">{a.city} • {a.type} • {a.price}</div>
                    <div className="text-sm text-gray-500">Owner: {a.ownerId}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(a.id)} className="px-4 py-2 rounded-lg bg-green-600 text-white">
                      Approve
                    </button>
                    <button onClick={() => handleReject(a.id)} className="px-4 py-2 rounded-lg bg-red-600 text-white">
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {tab === 'messages' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {messages.length === 0 ? (
              <div className="p-6 text-gray-600">No messages.</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="text-sm text-gray-800">
                    <div className="font-medium">{m.name || 'Anonymous'} ({m.email || 'no email'})</div>
                    <div>Phone: {m.phone || '-'}</div>
                    <div className="mt-2 whitespace-pre-wrap text-gray-600">{m.message}</div>
                    <div className="mt-2 text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                  <button onClick={() => handleDeleteMessage(m.id)} className="px-4 py-2 rounded-lg bg-gray-900 text-white">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {tab === 'users' ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <div className="p-6 text-gray-600">No users.</div>
            ) : (
              users.map((u) => (
                <div key={u.id} className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-600">{u.email}</div>
                    <div className="text-xs text-gray-500">Role: {u.role} • {u.isBanned ? 'BANNED' : 'ACTIVE'}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleBan(u.id, !!u.isBanned)}
                      className={`px-4 py-2 rounded-lg ${u.isBanned ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                    <button
                      onClick={() => handleToggleRole(u.id, u.role)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                    >
                      Toggle Role
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}

      {tab === 'stats' ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {!stats ? (
            <div className="text-gray-600">No stats.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="text-sm text-gray-600">Users</div>
                <div className="text-2xl font-bold">{stats.users}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="text-sm text-gray-600">Apartments</div>
                <div className="text-2xl font-bold">{stats.apartments}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border">
                <div className="text-sm text-gray-600">Approved visible</div>
                <div className="text-2xl font-bold">{stats.approvedVisible}</div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
