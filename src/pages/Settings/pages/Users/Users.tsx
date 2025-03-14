import type React from "react";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Register from "./components/Register/Register";
import { MailIcon, User } from "lucide-react";
import { deleteUser, getUsers } from "../../../../api/apiUsers";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}
function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setNewUser({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setNewUser({ name: "", email: "", role: "" });
    }

    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers(users.filter((usr) => usr.id !== id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gestión de Usuarios
      </h1>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative"
          >
            <div
              onClick={() => handleOpenForm(user)}
              className="cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{user.name}</h2>
              <div className="flex items-center text-gray-600">
                <MailIcon className="h-5 w-5 mr-2" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-2" />
                <span>{user.role}</span>
              </div>
            </div>
            <button
              onClick={() => setDeleteConfirmation(user.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            {deleteConfirmation === user.id && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="text-center">
                  <p className="mb-2">
                    ¿Estás seguro de eliminar este usuario?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => handleOpenForm()}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black opacity-90 overflow-y-auto h-full w-full flex items-center justify-center">
          <Register onClose={setIsFormOpen} editingUser={editingUser} />
        </div>
      )}
    </div>
  );
}
export default Users;
