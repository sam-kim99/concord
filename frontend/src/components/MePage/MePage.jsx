import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import ServerList from '../ServerList/ServerList';
import { logoutUser } from '../../store/sessionReducer';
import {
    fetchFriendships,
    sendFriendRequest,
    acceptFriendship,
    rejectFriendship,
    destroyFriendship,
    openDirectMessage,
    searchUsers,
} from '../../store/friendsReducer';
import { fetchServers } from '../../store/serverReducer';
import DiscordNoodle from '../../assets/discordnoodle.gif';
import DoorClose from '../../assets/logout.png';
import './MePage.css';

const TABS = [
    { key: 'all',     label: 'All Friends' },
    { key: 'pending', label: 'Pending' },
    { key: 'add',     label: 'Add Friend' },
];

const MePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sessionUser = useSelector(state => state.session);
    const friendsState = useSelector(state => state.friends);
    const servers = useSelector(state => state.server);

    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (!sessionUser?.username) {
            navigate('/login');
            return;
        }
        dispatch(fetchFriendships()).catch(err => console.error('Failed to load friendships', err));
        dispatch(fetchServers()).catch(() => {});
    }, [sessionUser?.username, dispatch, navigate]);

    const meId = sessionUser?.id;

    const { accepted, incoming, outgoing } = useMemo(() => {
        const all = Object.values(friendsState);
        const accepted = [];
        const incoming = [];
        const outgoing = [];
        const seenAccepted = new Set();
        all.forEach(f => {
            if (f.status === 'accepted') {
                const otherId = f.userId === meId ? f.friendId : f.userId;
                if (!seenAccepted.has(otherId)) {
                    seenAccepted.add(otherId);
                    accepted.push({ ...f, otherId, otherUsername: f.userId === meId ? f.friendUsername : f.userUsername });
                }
            } else if (f.status === 'pending') {
                if (f.friendId === meId) {
                    incoming.push({ ...f, otherId: f.userId, otherUsername: f.userUsername });
                } else if (f.userId === meId) {
                    outgoing.push({ ...f, otherId: f.friendId, otherUsername: f.friendUsername });
                }
            }
        });
        return { accepted, incoming, outgoing };
    }, [friendsState, meId]);

    const dmServers = useMemo(() => (
        Object.values(servers || {}).filter(s => s.dmServer)
    ), [servers]);

    const handleSignout = e => {
        e.preventDefault();
        dispatch(logoutUser());
    };

    const handleMessage = async (userId) => {
        try {
            const server = await dispatch(openDirectMessage(userId));
            const channelId = Array.isArray(server.channels) ? server.channels[0] : null;
            if (channelId) navigate(`/channels/${server.id}/${channelId}`);
        } catch (err) {
            console.error('Failed to open DM', err);
        }
    };

    const handleRemoveFriendship = async (id) => {
        try { await dispatch(destroyFriendship(id)); } catch (err) { console.error(err); }
    };

    if (!sessionUser?.username) return null;

    return (
        <div className='main-page-container'>
            <div className='server-list'>
                <ServerList />
            </div>
            <div className='sidebar me-sidebar'>
                <div className='top-bar me-top-bar'>
                    <div className='top-bar-dropdown me-top-bar-dropdown'>
                        <div className='top-bar-header'>
                            <div className='server-name'>
                                <h1>Friends</h1>
                            </div>
                        </div>
                    </div>
                    <div className='me-dm-section'>
                        <h3 className='me-section-header'>DIRECT MESSAGES</h3>
                        <ul className='me-dm-list'>
                            {dmServers.map(s => {
                                const channelId = Array.isArray(s.channels) ? s.channels[0] : null;
                                const otherName = (s.name || '').replace('@'+sessionUser.username, '').replace(/^[ &@]+|[ &@]+$/g, '');
                                return (
                                    <li key={s.id} className='me-dm-item'>
                                        <Link to={`/channels/${s.id}/${channelId}`}>
                                            <div className='me-dm-avatar'>{(otherName[0] || '?').toUpperCase()}</div>
                                            <div className='me-dm-name'>{otherName || s.name}</div>
                                        </Link>
                                    </li>
                                );
                            })}
                            {dmServers.length === 0 && <li className='me-dm-empty'>No conversations yet</li>}
                        </ul>
                    </div>
                </div>
                <div className='user-info-container'>
                    <div className='user-info'>
                        <p>{sessionUser.username}</p>
                    </div>
                    <div className='logout-button' onClick={handleSignout}>
                        <img src={DoorClose} alt='log out'/>
                    </div>
                </div>
            </div>
            <div className='content me-content'>
                <div className='me-header'>
                    <h2 className='me-header-title'>Friends</h2>
                    <nav className='me-tabs'>
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`me-tab ${activeTab === t.key ? 'active' : ''} ${t.key === 'add' ? 'add-cta' : ''}`}
                            >
                                {t.label}
                                {t.key === 'pending' && (incoming.length + outgoing.length) > 0 && (
                                    <span className='me-badge'>{incoming.length + outgoing.length}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className='me-tab-content'>
                    {activeTab === 'all'     && <AllFriendsList friends={accepted} onMessage={handleMessage} onRemove={handleRemoveFriendship}/>}
                    {activeTab === 'pending' && <PendingList incoming={incoming} outgoing={outgoing}
                                                             onAccept={(id) => dispatch(acceptFriendship(id))}
                                                             onReject={(id) => dispatch(rejectFriendship(id))}
                                                             onCancel={handleRemoveFriendship} />}
                    {activeTab === 'add'     && <AddFriendForm meId={meId} onSent={() => setActiveTab('pending')} dispatch={dispatch} />}
                </div>
            </div>
        </div>
    );
};

const AllFriendsList = ({ friends, onMessage, onRemove }) => {
    if (friends.length === 0) {
        return (
            <div className='me-empty'>
                <img src={DiscordNoodle} alt='' className='me-empty-img'/>
                <p>You don&apos;t have any friends yet. Use the Add Friend tab to send a request.</p>
            </div>
        );
    }
    return (
        <ul className='me-friend-list'>
            {friends.map(f => (
                <li key={f.id} className='me-friend-row'>
                    <div className='me-friend-avatar'>{f.otherUsername[0]?.toUpperCase()}</div>
                    <div className='me-friend-info'>
                        <div className='me-friend-name'>{f.otherUsername}</div>
                        <div className='me-friend-sub'>Friend</div>
                    </div>
                    <div className='me-friend-actions'>
                        <button className='me-action-btn' onClick={() => onMessage(f.otherId)}>Message</button>
                        <button className='me-action-btn danger' onClick={() => onRemove(f.id)}>Remove</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const PendingList = ({ incoming, outgoing, onAccept, onReject, onCancel }) => {
    if (incoming.length === 0 && outgoing.length === 0) {
        return <div className='me-empty'><p>No pending requests.</p></div>;
    }
    return (
        <>
            {incoming.length > 0 && (
                <>
                    <div className='me-pending-header'>INCOMING — {incoming.length}</div>
                    <ul className='me-friend-list'>
                        {incoming.map(f => (
                            <li key={f.id} className='me-friend-row'>
                                <div className='me-friend-avatar'>{f.otherUsername[0]?.toUpperCase()}</div>
                                <div className='me-friend-info'>
                                    <div className='me-friend-name'>{f.otherUsername}</div>
                                    <div className='me-friend-sub'>Incoming Friend Request</div>
                                </div>
                                <div className='me-friend-actions'>
                                    <button className='me-action-btn primary' onClick={() => onAccept(f.id)}>Accept</button>
                                    <button className='me-action-btn danger' onClick={() => onReject(f.id)}>Ignore</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {outgoing.length > 0 && (
                <>
                    <div className='me-pending-header'>OUTGOING — {outgoing.length}</div>
                    <ul className='me-friend-list'>
                        {outgoing.map(f => (
                            <li key={f.id} className='me-friend-row'>
                                <div className='me-friend-avatar'>{f.otherUsername[0]?.toUpperCase()}</div>
                                <div className='me-friend-info'>
                                    <div className='me-friend-name'>{f.otherUsername}</div>
                                    <div className='me-friend-sub'>Outgoing Friend Request</div>
                                </div>
                                <div className='me-friend-actions'>
                                    <button className='me-action-btn danger' onClick={() => onCancel(f.id)}>Cancel</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
};

const AddFriendForm = ({ meId, onSent, dispatch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState({ kind: 'idle' });

    useEffect(() => {
        const trimmed = query.trim();
        if (trimmed.length < 2) { setResults([]); return; }
        let cancelled = false;
        const t = setTimeout(async () => {
            try {
                const data = await searchUsers(trimmed);
                if (!cancelled) setResults(data.filter(u => u.id !== meId));
            } catch (err) {
                if (!cancelled) setResults([]);
            }
        }, 200);
        return () => { cancelled = true; clearTimeout(t); };
    }, [query, meId]);

    const handleSend = async (id, username) => {
        setStatus({ kind: 'sending', id });
        try {
            await dispatch(sendFriendRequest(id));
            setStatus({ kind: 'sent', message: `Friend request sent to ${username}!` });
            setQuery('');
            setResults([]);
            setTimeout(() => onSent && onSent(), 700);
        } catch (err) {
            const data = err.json ? await err.json().catch(() => ({})) : {};
            setStatus({ kind: 'error', message: (data.errors && data.errors.join(', ')) || 'Could not send request' });
        }
    };

    return (
        <div className='me-add-friend'>
            <h3 className='me-add-title'>ADD FRIEND</h3>
            <p className='me-add-sub'>You can add friends by their username.</p>
            <div className='me-add-input-wrap'>
                <input
                    className='me-add-input'
                    placeholder='Type a username'
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    autoFocus
                />
            </div>
            {status.kind === 'sent'  && <div className='me-add-msg success'>{status.message}</div>}
            {status.kind === 'error' && <div className='me-add-msg error'>{status.message}</div>}
            {results.length > 0 && (
                <ul className='me-add-results'>
                    {results.map(u => (
                        <li key={u.id} className='me-add-result-row'>
                            <div className='me-friend-avatar'>{u.username[0]?.toUpperCase()}</div>
                            <div className='me-friend-name'>{u.username}</div>
                            <button className='me-action-btn primary' onClick={() => handleSend(u.id, u.username)} disabled={status.kind === 'sending'}>
                                {status.kind === 'sending' && status.id === u.id ? 'Sending…' : 'Send Request'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MePage;
