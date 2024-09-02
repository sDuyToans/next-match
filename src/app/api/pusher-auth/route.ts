import {auth} from "@/auth";
import {pusherSever} from "@/lib/pusher";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new Response('Unauthorized', {status: 404})
        }

        const body = await request.formData();

        const socketId = body.get('socket_id') as string;
        const channel = body.get('channel_name') as string;
        const data = {
            user_id: session.user.id
        }

        const authResponse = pusherSever.authorizeChannel(socketId, channel, data);
        return NextResponse.json(authResponse);
    } catch (err) {
        console.log(err);
        throw err;

    }
}

