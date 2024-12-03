
import './App.css';
import React from 'react';

import {useEffect, useState} from 'react';
import axios from 'axios';

const baseURL = "http://miapiproyectoweb.somee.com/api/Person";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [correo, setCorreo] = useState("");
  const [numero, setNumero] = useState("");
  const [Id, setEditId] = useState(null);

  // Fetch existing posts from API on component mount
  useEffect(() => {
    axios.get(baseURL).then((response) => {
      setPosts(response.data);
    }).catch(error => {
      console.error("There was an error fetching the posts!", error);
    });
  }, []);

  // Create or update a person
  const handleSubmit = (e) => {
    e.preventDefault();
    const personData = {
      name: nombre,
      age: edad,
      nationality: nacionalidad,
      email: correo,
      phone: numero
    };

    if (Id) {
      // Update existing person
      axios.put(`${baseURL}/${Id}`, personData)
        .then((response) => {
          const updatedPosts = posts.map(post => 
            post.id === response.data.id ? response.data : post
          );
          setPosts(updatedPosts);
          resetForm();
        })
        .catch((error) => {
          console.error("There was an error updating the post!", error);
        });
    } else {
      // Create new person
      axios.post(baseURL, personData)
        .then((response) => {
          setPosts([...posts, response.data]);
          resetForm();
        })
        .catch((error) => {
          console.error("There was an error creating the post!", error);
        });
    }
  };

  // Delete a person
  const handleDelete = (id) => {
    axios.delete(`${baseURL}/${id}`)
      .then(() => {
        setPosts(posts.filter(post => post.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the post!", error);
      });
  };

  // Reset form fields and editId
  const resetForm = () => {
    setNombre("");
    setEdad("");
    setNacionalidad("");
    setCorreo("");
    setNumero("");
    setEditId(null);
  };

  // Set form fields for editing
  const handleEdit = (post) => {
    setNombre(post.name);
    setEdad(post.age);
    setNacionalidad(post.nationality);
    setCorreo(post.email);
    setNumero(post.phone);
    setEditId(post.id);
  };

  return (
    <div className="App">
      <h1>Usuarios</h1>
      <ul>
        {posts.length > 0 ? (
          posts.map((userObj) => (
            <li key={userObj.id}>
              {userObj.name}, {userObj.age}, {userObj.nationality}, 
              {userObj.email}, {userObj.phone}
              <button onClick={() => handleEdit(userObj)}>Edit</button>
              <button onClick={() => handleDelete(userObj.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No posts available.</li>
        )}
      </ul>

      {/* Formulario para crear o actualizar una persona */}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </label>
        <br />
        <label>
          Edad:
          <input
            type="number"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />
        </label>
        <br />
        <label>
          Nacionalidad:
          <input
            type="text"
            value={nacionalidad}
            onChange={(e) => setNacionalidad(e.target.value)}
          />
        </label>
        <br />
        <label>
          Correo:
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </label>
        <br />
        <label>
          Número:
          <input
            type="tel"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">{Id ? "Update" : "Agregar persona"}</button>
      </form>
    </div>
  );
}
