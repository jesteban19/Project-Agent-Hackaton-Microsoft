import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  startListening,
  stopListening,
  setError,
  setProcessing,
} from "../store/slices/speechSlice";
import * as speechsdk from "microsoft-cognitiveservices-speech-sdk";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";

interface ChatMessage {
  type: "user" | "agent";
  content: string;
  timestamp: Date;
}

const Home = () => {
  const dispatch = useDispatch();
  const { isListening, error, processing } = useSelector(
    (state: RootState) => state.speech
  );
  const [speechConfig, setSpeechConfig] =
    useState<speechsdk.SpeechConfig | null>(null);
  const [recognizer, setRecognizer] =
    useState<speechsdk.SpeechRecognizer | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [flowClosed, setFlowClosed] = useState(false);

  useEffect(() => {
    const config = speechsdk.SpeechConfig.fromSubscription(
      import.meta.env.VITE_AZURE_SPEECH_KEY || "",
      import.meta.env.VITE_AZURE_SPEECH_REGION || ""
    );
    config.speechRecognitionLanguage = "es-PE";
    setSpeechConfig(config);
  }, []);

  const toggleRecording = async () => {
    if (isListening) {
      await stopRecording();
    } else {
      if (flowClosed) {
        setChatHistory([]);
        setFlowClosed(false);
      }
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (!speechConfig) return;

    try {
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const newRecognizer = new speechsdk.SpeechRecognizer(
        speechConfig,
        audioConfig
      );

      dispatch(startListening());
      setCurrentTranscript(""); // Clear current transcript for new recording

      newRecognizer.recognizing = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizingSpeech) {
          setCurrentTranscript(e.result.text);
        }
      };

      newRecognizer.recognized = (s, e) => {
        if (e.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
          const newText = e.result.text.trim();
          if (newText) {
            setCurrentTranscript(newText);
            const userMessage: ChatMessage = {
              type: "user",
              content: newText,
              timestamp: new Date(),
            };
            setChatHistory((prev) => [...prev, userMessage]);
            setCurrentTranscript("");
          }
        }
      };

      newRecognizer.canceled = (s, e) => {
        dispatch(setError(e.errorDetails));
        dispatch(stopListening());
      };

      await newRecognizer.startContinuousRecognitionAsync();
      setRecognizer(newRecognizer);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error starting speech recognition";
      dispatch(setError(errorMessage));
    }
  };

  const stopRecording = async () => {
    if (recognizer) {
      try {
        await recognizer.stopContinuousRecognitionAsync();
        await recognizer.close();
        setRecognizer(null);
      } catch (error) {
        console.error("Error stopping recognizer:", error);
      }
    }
    dispatch(stopListening());

    // Send complete user chat history to agent
    const userMessages = chatHistory
      .filter((message) => message.type === "user")
      .map((message) => message.content)
      .join(" ");

    if (userMessages.trim() !== "") {
      sendToAgent(userMessages);
    }
  };

  const sendToAgent = async (message: string) => {
    try {
      dispatch(setProcessing(true));
      const response = await fetch("/api/handler/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error("Failed to get agent response");
      }

      const data = await response.json();
      const result = JSON.parse(data.message);
      const agentMessage: ChatMessage = {
        type: "agent",
        content: result.response,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, agentMessage]);

      if (result.registered) {
        setFlowClosed(true);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error communicating with agent";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setProcessing(false));
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-4 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Asistente Financiero
          </h1>
          <p className="text-gray-600">
            Habla tu transacción o pide consejos financieros
          </p>
        </div>

        <div className="flex-1 flex flex-col space-y-4 overflow-y-auto pb-24">
          {chatHistory.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-white p-8 rounded-3xl shadow-lg max-w-sm w-full">
                <div className="mb-6">
                  <svg
                    className="w-24 h-24 mx-auto text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  ¡Bienvenido a tu Asistente Financiero!
                </h2>
                <p className="text-gray-600 mb-6">
                  Presiona el botón del micrófono y comienza a hablar para:
                </p>
                <ul className="text-left text-gray-600 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Registrar ingresos y gastos
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Consultar tu balance
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Obtener consejos financieros
                  </li>
                </ul>
                <div className="text-sm text-gray-500">
                  Tu información se procesará automáticamente
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl max-w-[80%] shadow-md ${
                    message.type === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {message.type === "agent" ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            ))
          )}

          {error && (
            <div className="w-full bg-red-50 p-4 rounded-2xl shadow-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {isListening && currentTranscript && (
            <div className="flex justify-end">
              <div className="bg-primary-500/50 text-white p-4 rounded-2xl max-w-[80%] shadow-md">
                <p>{currentTranscript}</p>
                <div className="flex mt-2">
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full mx-0.5"></div>
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full mx-0.5 delay-100"></div>
                  <div className="animate-pulse w-2 h-2 bg-white rounded-full mx-0.5 delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-20 left-0 right-0 flex justify-center">
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full ${
                isListening ? "bg-red-500/20 animate-ping" : "bg-primary-500/20"
              }`}
            ></div>
            <button
              onClick={toggleRecording}
              disabled={processing}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-600"
              }`}
            >
              {isListening ? (
                <PaperAirplaneIcon className="w-12 h-12 text-white transform rotate-90" />
              ) : (
                <MicrophoneIcon
                  className={`w-12 h-12 ${
                    processing ? "text-gray-200" : "text-white"
                  }`}
                />
              )}
            </button>
          </div>
        </div>

        {processing && (
          <div className="fixed bottom-32 left-0 right-0 flex justify-center">
            <div className="bg-white p-3 rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
