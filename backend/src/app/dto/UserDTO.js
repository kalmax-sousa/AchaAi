class UserDTO {
  constructor({ id, name, email, admin, enrollment, image_url }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.enrollment = enrollment;
    this.image_url = image_url;
    this.admin = admin;
  }
}

export default UserDTO;
