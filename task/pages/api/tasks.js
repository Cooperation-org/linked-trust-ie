import { prisma } from "../../db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const tasks = await prisma.task.findMany();
    return res.status(200).json({ tasks });
  }
  res.status(500).json({ message: "Something went wrong!" });
}