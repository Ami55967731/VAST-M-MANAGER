import "./RatingAvatar.css";

import Avatar1 from "../../assets/images/Ellipse 42.svg";
import Avatar2 from "../../assets/images/Ellipse 43.svg";
import Avatar3 from "../../assets/images/Ellipse 44.svg";
import Avatar4 from "../../assets/images/Ellipse 45.svg";
import Avatar5 from "../../assets/images/Ellipse 46.svg";

const avatars = [
  {
    id: 1,
    image: Avatar1,
    className: "avatar-large",
  },
  {
    id: 2,
    image: Avatar2,
    className: "avatar-left",
  },
  {
    id: 3,
    image: Avatar3,
    className: "avatar-right",
  },
  {
    id: 4,
    image: Avatar4,
    className: "avatar-bottom-left",
  },
  {
    id: 5,
    image: Avatar5,
    className: "avatar-bottom-right",
  },
];

export default function RatingAvatars() {
  return (
    <div className="rating-avatars">
      {avatars.map((avatar) => (
        <img
          key={avatar.id}
          src={avatar.image}
          alt=""
          className={`rating-avatar ${avatar.className}`}
        />
      ))}
    </div>
  );
}