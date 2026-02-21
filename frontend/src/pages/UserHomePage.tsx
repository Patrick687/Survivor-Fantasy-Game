import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../app/store";
import { useEffect } from "react";
import { getMyLeagues } from "../league/league.slice";

const UserHomePage: React.FC = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    const leagueState = useSelector((state: RootState) => state.league);


    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getMyLeagues());
    }, []);


    return (
        <>
            <div id='welcome-section' className="text-center max-w-lg">
                <h1 className="text-3xl text-dark-amethyst-300">Welcome {user?.userName}!</h1>
                <div id='leagues-section'>
                    {leagueState.loading && <div>Loading leagues...</div>}
                    {!leagueState.loading && (
                        <div>
                            <p>Num Leagues: {leagueState.userLeagues.length}</p>
                            <ul>
                                {leagueState.userLeagues.map((league) => (
                                    <li key={league.id}>
                                        {league.name} (ID: {league.id})
                                    </li>
                                ))}
                            </ul>
                        </div>

                    )}
                </div>
            </div>
        </>
    );
};

export default UserHomePage;