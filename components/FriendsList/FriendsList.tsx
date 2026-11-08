"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFriends } from "@/lib/clientApi";
import FriendsItem from "../FriendsItem/FriendsItem";
import css from "./FriendsList.module.css";

export default function FriendsList() {
  const {
    data: friends = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: fetchFriends,
  });

  if (isPending) {
    return <p>Loading friends...</p>;
  }

  if (isError) {
    return <p>Failed to load friends.</p>;
  }

  return (
    <ul className={css.list}>
      {friends.map((friend) => (
        <li key={friend._id} className={css.item}>
          <FriendsItem friend={friend} />
        </li>
      ))}
    </ul>
  );
}