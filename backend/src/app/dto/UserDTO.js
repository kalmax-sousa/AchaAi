class UserDTO {
  constructor({ id, name, email, phonenumber, admin, enrollment, image_url }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phonenumber = phonenumber;
    this.enrollment = enrollment;
    this.image_url = image_url;
    this.admin = admin;
  }
}

export default UserDTO;
