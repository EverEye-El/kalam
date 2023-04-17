import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useEventListener, useHuddle01 } from '@huddle01/react';
import { useEffect, useRef } from 'react';
import { 
	useLobby, 
	useMeetingMachine, 
	useAudio, 
	useVideo, 
	useRoom, 
	usePeers 
} from '@huddle01/react/hooks';
import { Video } from "@huddle01/react/components";



export default function InstructionsComponent() {
	const router = useRouter();
	const { initialize, isInitialized } = useHuddle01();
  	const { joinLobby } = useLobby();
	const {state} = useMeetingMachine();
	const { 
		fetchAudioStream, 
		stopAudioStream, 
		error: micError,
		produceAudio, 
		stopProducingAudio,
		stream: micStream
	} = useAudio();
  	const { 
		fetchVideoStream, 
		stopVideoStream, 
		error: camError,
		produceVideo, 
		stopProducingVideo,
		stream: camStream  
	} = useVideo();
	const { joinRoom, leaveRoom } = useRoom();
	const { peerIds, peers } = usePeers();

	  useEffect(() => {
		// its preferable to use env vars to store projectId
		initialize("KL1r3E1yHfcrRbXsT4mcE-3mK60Yc3YR");
	  }, []);

	  const videoRef = useRef<HTMLVideoElement>(null);

	  useEventListener('lobby:cam-on', () => {
		if (state.context.camStream && videoRef.current)
		videoRef.current.srcObject = state.context.camStream as MediaStream;
	  });

	return (
		<div className={styles.container}>
			<h2 className="text-2xl">{isInitialized ? 'Hello World! kalam GTFOL demo' : 'Please initialize'}</h2>
			<h2 className="text-2xl">Room State</h2>
			<h3>{JSON.stringify(state.value)}</h3>
			
			<button
				className="border-2 border-white p-3 rounded-lg" 
				disabled={!joinLobby.isCallable} 
				onClick={() => joinLobby("xoe-qhxh-xjo")}
			>
				Join Lobby
			</button>

			{/* Mic */} 
			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!fetchAudioStream.isCallable} 
			onClick={fetchAudioStream}
			>
				FETCH_AUDIO_STREAM
			</button>
	
			{/* Webcam */} 
			<button 
			className="border-2 border-white p-3 rounded-lg"
			disabled={!fetchVideoStream.isCallable} 
			onClick={fetchVideoStream}
			>
				FETCH_VIDEO_STREAM
			</button>
			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!joinRoom.isCallable} 
			onClick={joinRoom}
			>
          		JOIN_ROOM 
        	</button>
 
        	<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!leaveRoom.isCallable} 
			onClick={leaveRoom}
			>
          		LEAVE_ROOM 
       		</button>

			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!produceVideo.isCallable} 
			onClick={() => produceVideo(camStream)}
			>
          		Produce Cam  
			</button>
	
			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!produceAudio.isCallable} 
			onClick={() => produceAudio(micStream)}
			>
			Produce Mic  
			</button>
	
			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!stopProducingVideo.isCallable} 
			onClick={stopProducingVideo}
			>
			Stop Producing Cam  
			</button>
	
			<button 
			className="border-2 border-white p-3 rounded-lg" 
			disabled={!stopProducingAudio.isCallable} 
			onClick={stopProducingAudio}
			>
			Stop Producing Mic  
			</button>
			<video ref={videoRef} autoPlay muted></video>
			<div className="grid grid-cols-4">
				{Object.values(peers)
				 .filter((peer) => peer.cam)
				 .map((peer) => (
					<Video
					  key={peer.peerId}
					  peerId={peer.peerId}
					  track={peer.cam}
					  debug
					 />
				 ))}
			</div>

		</div>
	);
}
