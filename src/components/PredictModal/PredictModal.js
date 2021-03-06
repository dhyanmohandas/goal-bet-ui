import React, { useState } from 'react'
import { Modal, message } from 'antd';
import './PredictModal.scss'

const PredictModal = ({isModalVisible, handleCancel, handleSuccess, matchDetails, flag1, flag2}) => {

    const [username, setUsername] = useState('') 
    const [score1, setScore1] = useState() 
    const [score2, setScore2] = useState() 
    const [isLoading, setLoading] = useState(false)

    const handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    
    const handleOk = () => {
        setLoading(true)
        const body = {
          matchId: matchDetails._id,
          userId: username,
          teamGoals1:Number(score1),
          teamGoals2:Number(score2)
        }
        fetch("https://goal-bet-api.herokuapp.com/predictGoal", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(body)
      }).then(handleErrors).then(() => {
        message.success('Submitted your prediction')
        handleSuccess()
      }).catch(() => {
        message.error('Something went wrong')
        setLoading(false)
      })
        
    }

    const getModalContainer = () => {
        return <div className="predic-modal-body">
            <div className="user-container">
                <div className="userName">User ID</div>
                <input placeholder='Enter User ID' value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="prediction-container">
                <div className="home-team">
                    <div className="team">
                        <div>
                            <img alt="" src={flag1}/>
                        </div>
                        <span>{matchDetails.team1}</span>
                    </div>
                    <input type='number' value={score1}  onChange={(e) => setScore1(e.target.value)}/>
                </div>
                <div className="away-team">
                <div className="team">
                        <div>
                            <img alt="" src={flag2}/>
                        </div>
                        <span>{matchDetails.team2}</span>
                    </div>
                    <input type='number' value={score2}  onChange={(e) => setScore2(e.target.value)}/>
                </div>
            </div>
        </div>
    }

    const clearState = () => {
        setScore1('')
        setScore2('')
        setUsername('')
        setLoading(false)
    }
    
    return <Modal 
        title="Predict your score" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel} 
        okText="Confirm"
        className="predict-modal"
        closable={false}
        centered
        destroyOnClose
        afterClose={clearState}
        okButtonProps={{disabled: !(username && score1 && score2), loading:isLoading}}
        getContainer={document.getElementById('root')}>
            {getModalContainer()}
      </Modal>
}

export default PredictModal