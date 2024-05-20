import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

function EditUserModal() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleIdChange = (event) => {
    setId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleEditUser = async () => {
    if (!id || !name || !email || id === "" || name === "" || email === "") {
      toast.error("All Fields Are Required");
      return;
    }
    try {
      const res = await axios.put(`http://localhost:3000`, {
        id,
        name,
        email
      });

      if (res.status === 200) {
        toast.success("User Edited || Reloading to Update");
        setId("");
        setName("");
        setEmail("");
        setTimeout(() => {location.reload()}, 3000);
      }
    } catch (error) {
      console.error("Error Editing User", error);
      toast.error("Error Editing User");
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-warning"
        data-bs-toggle="modal"
        id="button"
        data-bs-target="#editUserModal"
      >
        <b>Edit User</b>
      </button>

      <div
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        aria-labelledby="EditUserModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="EditUserModal">
                <b>Enter Id, Name and Email</b>
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="id" className="form-label">
                  Id:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="id"
                  placeholder="Ex: 12"
                  value={id}
                  onChange={handleIdChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  New Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Ex: John Doe"
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  New Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Ex: johndoe@gmail.com"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleEditUser}
                data-bs-dismiss="modal"
              >
                <b>Edit User</b>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUserModal;
